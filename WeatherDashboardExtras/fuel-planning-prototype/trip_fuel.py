from __future__ import annotations

from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from typing import Iterable, Optional


@dataclass(frozen=True)
class Vehicle:
    label: str
    tank_capacity_gal: float
    avg_mpg: float
    fuel_grade: str = "regular"

    @property
    def full_tank_range_miles(self) -> float:
        return self.tank_capacity_gal * self.avg_mpg


@dataclass(frozen=True)
class RangePolicy:
    latest_stop_miles_left: float = 40
    earliest_stop_tank_fraction: float = 0.25
    max_station_detour_miles: float = 5
    stale_price_hours: float = 72

    def usable_range_miles(self, vehicle: Vehicle, tank_fraction: float = 1.0) -> float:
        return max(0, vehicle.full_tank_range_miles * tank_fraction - self.latest_stop_miles_left)

    def preferred_distance_after_fill(self, vehicle: Vehicle) -> float:
        return vehicle.full_tank_range_miles * (1 - self.earliest_stop_tank_fraction)


@dataclass(frozen=True)
class Station:
    id: str
    name: str
    brand: str
    address: str
    lat: float
    lon: float
    route_mile: float
    detour_miles: float
    price_per_gal: Optional[float]
    fuel_grade: str = "regular"
    updated_at: Optional[str] = None
    provider: str = "unknown"
    confidence: float = 0.0
    is_average: bool = False

    @classmethod
    def from_dict(cls, data):
        allowed = {field.name for field in cls.__dataclass_fields__.values()}
        return cls(**{key: value for key, value in data.items() if key in allowed})


@dataclass
class StopPurchase:
    station: Station
    miles_since_fill: float
    gallons_bought: float
    cost: float
    effective_price_per_gal: float
    gallons_remaining_on_arrival: float
    forced_early_stop: bool
    warnings: list[str] = field(default_factory=list)


@dataclass
class FuelPlan:
    total_route_miles: float
    total_gallons_needed: float
    estimated_total_cost: float
    full_tank_range_miles: float
    usable_range_miles: float
    preferred_stop_after_miles: float
    stops: list[StopPurchase]
    segment_miles: list[float]
    warnings: list[str] = field(default_factory=list)

    def to_dict(self):
        data = asdict(self)
        data["stops"] = [
            {
                "station": asdict(stop.station),
                "miles_since_fill": stop.miles_since_fill,
                "gallons_bought": stop.gallons_bought,
                "cost": stop.cost,
                "effective_price_per_gal": stop.effective_price_per_gal,
                "gallons_remaining_on_arrival": stop.gallons_remaining_on_arrival,
                "forced_early_stop": stop.forced_early_stop,
                "warnings": stop.warnings
            }
            for stop in self.stops
        ]
        return data


class NoFeasibleFuelPlan(RuntimeError):
    pass


def normalize_vehicle(data) -> Vehicle:
    if isinstance(data, Vehicle):
        return data
    return Vehicle(**data)


def normalize_policy(data) -> RangePolicy:
    if isinstance(data, RangePolicy):
        return data
    return RangePolicy(**data)


def normalize_stations(stations: Iterable[Station | dict]) -> list[Station]:
    return [
        station if isinstance(station, Station) else Station.from_dict(station)
        for station in stations
    ]


def _parse_datetime(value):
    if not value:
        return None
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def _station_warnings(station: Station, policy: RangePolicy, now: datetime) -> list[str]:
    warnings = []
    if station.price_per_gal is None:
        warnings.append("missing price")
    if station.is_average:
        warnings.append("regional average")
    updated_at = _parse_datetime(station.updated_at)
    if updated_at is None:
        warnings.append("no timestamp")
    else:
        if updated_at.tzinfo is None:
            updated_at = updated_at.replace(tzinfo=timezone.utc)
        comparable_now = now
        if comparable_now.tzinfo is None:
            comparable_now = comparable_now.replace(tzinfo=timezone.utc)
        age_hours = (comparable_now - updated_at).total_seconds() / 3600
        if age_hours > policy.stale_price_hours:
            warnings.append("stale price")
    return warnings


def _candidate_paths(route_total, stations, vehicle, policy, initial_tank_fraction):
    ordered = sorted(stations, key=lambda station: station.route_mile)
    nodes = [None] + ordered + [None]
    miles = [0] + [station.route_mile for station in ordered] + [route_total]
    destination_index = len(nodes) - 1
    preferred = policy.preferred_distance_after_fill(vehicle)
    memo = {}

    def max_range_from(index):
        if index == 0:
            return policy.usable_range_miles(vehicle, initial_tank_fraction)
        return policy.usable_range_miles(vehicle, 1.0)

    def solve(index):
        if index == destination_index:
            return [([], [])]
        if index in memo:
            return memo[index]

        current_mile = miles[index]
        max_range = max_range_from(index)
        reachable = []
        for next_index in range(index + 1, len(nodes)):
            distance = miles[next_index] - current_mile
            if distance > max_range + 1e-9:
                break
            if next_index == destination_index or nodes[next_index] is not None:
                reachable.append((next_index, distance))

        if not reachable:
            memo[index] = []
            return []

        def build_paths(options):
            paths = []
            for next_index, distance in options:
                for suffix, segments in solve(next_index):
                    station = nodes[next_index]
                    selected = [] if station is None else [station]
                    paths.append((selected + suffix, [distance] + segments))
            return paths

        preferred_reachable = [
            item for item in reachable
            if item[1] >= preferred or item[0] == destination_index
        ]
        paths = build_paths(preferred_reachable)
        if not paths and preferred_reachable != reachable:
            paths = build_paths(reachable)

        memo[index] = paths
        return paths

    return solve(0)


def _score_path(
    stops,
    segments,
    vehicle,
    policy,
    now,
    initial_tank_fraction,
    fallback_price_per_gal
):
    gallons_remaining = vehicle.tank_capacity_gal * initial_tank_fraction
    total_cost = 0
    purchases = []
    warnings = []
    preferred = policy.preferred_distance_after_fill(vehicle)

    for index, station in enumerate(stops):
        segment = segments[index]
        gallons_remaining -= segment / vehicle.avg_mpg
        if gallons_remaining < -1e-6:
            return None
        gallons_to_full = vehicle.tank_capacity_gal - gallons_remaining
        price = station.price_per_gal
        if price is None:
            price = fallback_price_per_gal
        cost = gallons_to_full * price
        station_warnings = _station_warnings(station, policy, now)
        forced_early = segment < preferred
        purchase = StopPurchase(
            station=station,
            miles_since_fill=segment,
            gallons_bought=gallons_to_full,
            cost=cost,
            effective_price_per_gal=price,
            gallons_remaining_on_arrival=gallons_remaining,
            forced_early_stop=forced_early,
            warnings=station_warnings
        )
        purchases.append(purchase)
        total_cost += cost
        warnings.extend(station_warnings)
        if forced_early:
            warnings.append(f"forced early stop at {station.name}")
        gallons_remaining = vehicle.tank_capacity_gal

    if segments:
        final_segment = segments[-1]
        gallons_remaining -= final_segment / vehicle.avg_mpg
        if gallons_remaining < -1e-6:
            return None

    stale_count = sum("stale price" in purchase.warnings for purchase in purchases)
    average_count = sum("regional average" in purchase.warnings for purchase in purchases)
    missing_count = sum("missing price" in purchase.warnings for purchase in purchases)
    detour = sum(purchase.station.detour_miles for purchase in purchases)
    forced_count = sum(purchase.forced_early_stop for purchase in purchases)

    score = (
        len(purchases),
        round(total_cost, 2),
        round(detour, 2),
        missing_count,
        stale_count,
        average_count,
        forced_count
    )
    return score, purchases, total_cost, sorted(set(warnings))


def plan_fuel_stops(
    route,
    stations,
    vehicle,
    policy,
    initial_tank_fraction=1.0,
    now=None
) -> FuelPlan:
    vehicle = normalize_vehicle(vehicle)
    policy = normalize_policy(policy)
    now = now or datetime.now(timezone.utc)
    route_total = float(route["total_miles"])
    initial_tank_fraction = max(0.0, min(1.0, float(initial_tank_fraction)))
    candidates = [
        station for station in normalize_stations(stations)
        if station.fuel_grade == vehicle.fuel_grade
        and 0 < station.route_mile < route_total
        and station.detour_miles <= policy.max_station_detour_miles
    ]
    known_prices = [
        station.price_per_gal
        for station in candidates
        if station.price_per_gal is not None
    ]
    fallback_price_per_gal = (
        sum(known_prices) / len(known_prices)
        if known_prices
        else 0
    )

    paths = _candidate_paths(route_total, candidates, vehicle, policy, initial_tank_fraction)
    if not paths:
        raise NoFeasibleFuelPlan(
            "No fuel plan can satisfy the selected tank range, reserve, and station detour limits."
        )

    scored = []
    for stops, segments in paths:
        path_score = _score_path(
            stops,
            segments,
            vehicle,
            policy,
            now,
            initial_tank_fraction,
            fallback_price_per_gal
        )
        if path_score is not None:
            score, purchases, total_cost, warnings = path_score
            scored.append((score, purchases, total_cost, segments, warnings))

    if not scored:
        raise NoFeasibleFuelPlan("Candidate paths exist, but all consume more fuel than available.")

    score, purchases, total_cost, segments, warnings = min(scored, key=lambda item: item[0])
    return FuelPlan(
        total_route_miles=route_total,
        total_gallons_needed=route_total / vehicle.avg_mpg,
        estimated_total_cost=total_cost,
        full_tank_range_miles=vehicle.full_tank_range_miles,
        usable_range_miles=policy.usable_range_miles(vehicle),
        preferred_stop_after_miles=policy.preferred_distance_after_fill(vehicle),
        stops=purchases,
        segment_miles=segments,
        warnings=warnings
    )
