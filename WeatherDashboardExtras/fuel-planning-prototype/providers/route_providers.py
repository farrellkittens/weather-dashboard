import json
from math import asin, cos, radians, sin, sqrt
import os
from pathlib import Path


class RouteProviderError(RuntimeError):
    pass


def _haversine_miles(point_a, point_b):
    lon_a, lat_a = point_a
    lon_b, lat_b = point_b
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


def geometry_with_cumulative_miles(coordinates):
    """Convert GeoJSON [lon, lat] route coordinates to chart-ready mileage."""
    geometry = []
    cumulative = 0.0
    previous = None
    for lon, lat in coordinates:
        if previous is not None:
            cumulative += _haversine_miles(previous, (lon, lat))
        geometry.append({
            "lat": lat,
            "lon": lon,
            "mile": cumulative
        })
        previous = (lon, lat)
    return geometry


def _route_legs_from_distances(waypoints, distances_meters):
    legs = []
    for index, distance_meters in enumerate(distances_meters):
        origin = waypoints[index]["label"] if index < len(waypoints) else f"Waypoint {index + 1}"
        destination_index = index + 1
        destination = (
            waypoints[destination_index]["label"]
            if destination_index < len(waypoints)
            else f"Waypoint {destination_index + 1}"
        )
        legs.append({
            "from": origin,
            "to": destination,
            "miles": distance_meters / 1609.344
        })
    return legs


DEFAULT_FIXTURE_PATH = Path(__file__).resolve().parents[1] / "fixtures" / "trips" / "stanley_2026.json"


class MockRouteProvider:
    """Loads a pinned route fixture for offline planning and tests."""

    def __init__(self, fixture_path=DEFAULT_FIXTURE_PATH):
        self.fixture_path = Path(fixture_path)

    def get_route(self, waypoints=None):
        with self.fixture_path.open() as fh:
            fixture = json.load(fh)
        return fixture["route"]


class MapboxRouteProvider:
    """Small adapter around Mapbox Directions. Requires MAPBOX_ACCESS_TOKEN."""

    endpoint = "https://api.mapbox.com/directions/v5/mapbox/driving"

    def __init__(self, access_token=None):
        self.access_token = access_token or os.getenv("MAPBOX_ACCESS_TOKEN")
        if not self.access_token:
            raise RouteProviderError("MAPBOX_ACCESS_TOKEN is required for Mapbox routing")

    def get_route(self, waypoints):
        import requests

        coords = ";".join(f"{point['lon']},{point['lat']}" for point in waypoints)
        response = requests.get(
            f"{self.endpoint}/{coords}",
            params={
                "access_token": self.access_token,
                "overview": "full",
                "geometries": "geojson",
                "annotations": "distance"
            },
            timeout=30
        )
        response.raise_for_status()
        data = response.json()
        if not data.get("routes"):
            raise RouteProviderError("Mapbox returned no routes")
        route = data["routes"][0]
        miles = route["distance"] / 1609.344
        coordinates = route["geometry"]["coordinates"]
        geometry = geometry_with_cumulative_miles(coordinates)
        legs = _route_legs_from_distances(
            waypoints,
            [leg["distance"] for leg in route.get("legs", [])]
        )
        return {
            "provider": "mapbox",
            "total_miles": miles,
            "legs": legs,
            "geometry": geometry,
            "raw": data
        }


class OpenRouteServiceProvider:
    """Small adapter around openrouteservice directions. Requires ORS_API_KEY."""

    endpoint = "https://api.openrouteservice.org/v2/directions/driving-car"

    def __init__(self, api_key=None):
        self.api_key = api_key or os.getenv("ORS_API_KEY")
        if not self.api_key:
            raise RouteProviderError("ORS_API_KEY is required for openrouteservice routing")

    def get_route(self, waypoints):
        import requests

        response = requests.post(
            self.endpoint,
            json={
                "coordinates": [[point["lon"], point["lat"]] for point in waypoints],
                "geometry": True,
                "geometry_format": "geojson",
                "instructions": False
            },
            headers={"Authorization": self.api_key},
            timeout=30
        )
        response.raise_for_status()
        data = response.json()
        if not data.get("routes"):
            raise RouteProviderError("openrouteservice returned no routes")
        route = data["routes"][0]
        miles = route["summary"]["distance"] / 1609.344
        coordinates = []
        if isinstance(route.get("geometry"), dict):
            coordinates = route["geometry"].get("coordinates", [])
        legs = _route_legs_from_distances(
            waypoints,
            [segment["distance"] for segment in route.get("segments", [])]
        )
        return {
            "provider": "openrouteservice",
            "total_miles": miles,
            "legs": legs,
            "geometry": geometry_with_cumulative_miles(coordinates),
            "raw": data
        }
