import json
from math import asin, cos, radians, sin, sqrt
import os
from pathlib import Path


class FuelPriceProviderError(RuntimeError):
    pass


def _haversine_miles(lat_a, lon_a, lat_b, lon_b):
    radius_miles = 3958.7613
    d_lat = radians(lat_b - lat_a)
    d_lon = radians(lon_b - lon_a)
    lat_a = radians(lat_a)
    lat_b = radians(lat_b)
    root = (
        sin(d_lat / 2) ** 2
        + cos(lat_a) * cos(lat_b) * sin(d_lon / 2) ** 2
    )
    return 2 * radius_miles * asin(sqrt(root))


def _route_points(route):
    return sorted(
        [
            point for point in route.get("geometry", [])
            if point.get("lat") is not None
            and point.get("lon") is not None
            and point.get("mile") is not None
        ],
        key=lambda point: point["mile"]
    )


def _sample_route_points(route, spacing_miles=75):
    points = _route_points(route)
    if not points:
        return []
    sampled = [points[0]]
    next_mile = points[0]["mile"] + spacing_miles
    for point in points[1:-1]:
        if point["mile"] >= next_mile:
            sampled.append(point)
            next_mile = point["mile"] + spacing_miles
    if sampled[-1] is not points[-1]:
        sampled.append(points[-1])
    return sampled


def _nearest_route_position(route, lat, lon):
    points = _route_points(route)
    if not points:
        return None, None
    nearest = min(
        points,
        key=lambda point: _haversine_miles(lat, lon, point["lat"], point["lon"])
    )
    detour = _haversine_miles(lat, lon, nearest["lat"], nearest["lon"])
    return nearest["mile"], detour


def _first_float(*values):
    for value in values:
        if value in (None, ""):
            continue
        try:
            return float(value)
        except (TypeError, ValueError):
            continue
    return None


DEFAULT_FIXTURE_PATH = Path(__file__).resolve().parents[1] / "fixtures" / "trips" / "stanley_2026.json"


class MockFuelPriceProvider:
    """Loads fixture station prices and regional averages for offline use."""

    def __init__(self, fixture_path=DEFAULT_FIXTURE_PATH):
        self.fixture_path = Path(fixture_path)

    def get_prices(self, route, fuel_grade="regular", max_detour_miles=5):
        with self.fixture_path.open() as fh:
            fixture = json.load(fh)
        return [
            station
            for station in fixture["fuel_prices"]
            if station.get("fuel_grade") == fuel_grade
            and station.get("detour_miles", 999) <= max_detour_miles
        ]


class HereFuelPriceProvider:
    """Placeholder adapter for HERE Fuel Prices API corridor/station calls."""

    def __init__(self, api_key=None):
        self.api_key = api_key or os.getenv("HERE_API_KEY")
        if not self.api_key:
            raise FuelPriceProviderError("HERE_API_KEY is required for HERE fuel prices")

    def get_prices(self, route, fuel_grade="regular", max_detour_miles=5):
        raise NotImplementedError(
            "HERE corridor lookup needs project-specific entitlement details before use"
        )


class BarchartFuelPriceProvider:
    """Adapter for Barchart OnDemand getFuelPrices geo/radius calls."""

    endpoint = "https://ondemand.websol.barchart.com/getFuelPrices.json"
    product_by_grade = {
        "diesel": "USLD"
    }

    def __init__(self, api_key=None, session=None):
        self.api_key = api_key or os.getenv("BARCHART_API_KEY")
        if not self.api_key:
            raise FuelPriceProviderError("BARCHART_API_KEY is required for Barchart fuel prices")
        self.session = session

    def get_prices(self, route, fuel_grade="regular", max_detour_miles=5):
        import requests

        session = self.session or requests
        stations_by_id = {}
        product_name = self.product_by_grade.get(fuel_grade)
        for point in _sample_route_points(route):
            params = {
                "apikey": self.api_key,
                "latitude": point["lat"],
                "longitude": point["lon"],
                "maxDistance": max(1, min(250, max_detour_miles)),
                "totalLocations": 100,
                "page": 1,
                "fields": "companyId,productShort,productFull"
            }
            if product_name:
                params["productName"] = product_name
            response = session.get(self.endpoint, params=params, timeout=30)
            response.raise_for_status()
            payload = response.json()
            status = payload.get("status", {})
            if status.get("code") not in (200, 204, None):
                raise FuelPriceProviderError(status.get("message", "Barchart fuel lookup failed"))
            for result in payload.get("results", []):
                station = self._station_from_result(result, route, fuel_grade, max_detour_miles)
                if station:
                    current = stations_by_id.get(station["id"])
                    if current is None or station["detour_miles"] < current["detour_miles"]:
                        stations_by_id[station["id"]] = station
        return sorted(stations_by_id.values(), key=lambda station: station["route_mile"])

    def _station_from_result(self, result, route, fuel_grade, max_detour_miles):
        lat = _first_float(result.get("latitude"))
        lon = _first_float(result.get("longitude"))
        if lat is None or lon is None:
            return None
        route_mile, detour = _nearest_route_position(route, lat, lon)
        if route_mile is None or detour is None or detour > max_detour_miles:
            return None

        price = None
        selected_price = None
        prices = result.get("prices") or []
        if not isinstance(prices, list):
            prices = []
        for candidate in prices:
            product_text = " ".join(
                str(candidate.get(key, ""))
                for key in ("productShort", "product", "productFull", "productDescription")
            ).lower()
            if fuel_grade != "diesel" or "diesel" in product_text or "usld" in product_text:
                price = _first_float(
                    candidate.get("price"),
                    candidate.get("retailPrice"),
                    candidate.get("cashPrice"),
                    candidate.get("creditPrice")
                )
                selected_price = candidate
                if price is not None:
                    break
        if price is None:
            price = _first_float(
                result.get("price"),
                result.get("retailPrice"),
                result.get("cashPrice"),
                result.get("creditPrice")
            )

        city = result.get("city") or ""
        state = result.get("state") or ""
        address_bits = [
            result.get("address"),
            " ".join(part for part in (city, state) if part)
        ]
        updated_at = (
            (selected_price or {}).get("lastUpdateTimestamp")
            or result.get("lastUpdateTimestamp")
        )
        return {
            "id": f"barchart-{result.get('locationId') or result.get('location')}",
            "name": result.get("location") or "Barchart fuel location",
            "brand": result.get("company") or "Barchart",
            "address": ", ".join(part for part in address_bits if part),
            "lat": lat,
            "lon": lon,
            "route_mile": route_mile,
            "detour_miles": detour,
            "price_per_gal": price,
            "fuel_grade": fuel_grade,
            "updated_at": updated_at,
            "provider": "barchart",
            "confidence": 0.72 if price is not None else 0.4,
            "is_average": False
        }
