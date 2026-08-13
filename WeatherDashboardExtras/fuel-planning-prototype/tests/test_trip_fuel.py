import unittest
from datetime import datetime, timezone
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from trip_fuel import (
    NoFeasibleFuelPlan,
    RangePolicy,
    Station,
    Vehicle,
    plan_fuel_stops,
)
from providers.route_providers import geometry_with_cumulative_miles


class TripFuelTests(unittest.TestCase):
    def test_range_math_for_outback_fixture(self):
        vehicle = Vehicle("2014 Subaru Outback Premium 6MT", 16.9, 22.2)
        policy = RangePolicy(latest_stop_miles_left=40, earliest_stop_tank_fraction=0.25)

        self.assertEqual(round(vehicle.full_tank_range_miles, 1), 375.2)
        self.assertEqual(round(policy.usable_range_miles(vehicle), 1), 335.2)
        self.assertEqual(round(policy.preferred_distance_after_fill(vehicle), 1), 281.4)

    def test_impossible_gap_raises(self):
        vehicle = Vehicle("short range", 10, 10)
        policy = RangePolicy(latest_stop_miles_left=20, earliest_stop_tank_fraction=0.25)

        with self.assertRaises(NoFeasibleFuelPlan):
            plan_fuel_stops(
                {"total_miles": 250},
                [],
                vehicle,
                policy,
                initial_tank_fraction=1.0,
            )

    def test_cheapest_stop_wins_when_stop_count_is_equal(self):
        vehicle = Vehicle("test", 10, 10)
        policy = RangePolicy(
            latest_stop_miles_left=0,
            earliest_stop_tank_fraction=0.9,
            max_station_detour_miles=5,
        )
        stations = [
            Station("a", "Expensive", "A", "A", 0, 0, 90, 1, 5.00),
            Station("b", "Cheaper", "B", "B", 0, 0, 100, 1, 4.00),
        ]

        plan = plan_fuel_stops(
            {"total_miles": 180},
            stations,
            vehicle,
            policy,
            initial_tank_fraction=1.0,
        )

        self.assertEqual([stop.station.name for stop in plan.stops], ["Cheaper"])

    def test_stale_and_average_price_warnings(self):
        vehicle = Vehicle("test", 10, 10)
        policy = RangePolicy(
            latest_stop_miles_left=0,
            earliest_stop_tank_fraction=0.9,
            stale_price_hours=24,
        )
        station = Station(
            "avg",
            "Average Fuel",
            "Regional average",
            "Somewhere",
            0,
            0,
            90,
            1,
            4.25,
            updated_at="2026-07-01T00:00:00+00:00",
            is_average=True,
        )

        plan = plan_fuel_stops(
            {"total_miles": 180},
            [station],
            vehicle,
            policy,
            now=datetime(2026, 7, 22, tzinfo=timezone.utc),
        )

        self.assertIn("stale price", plan.stops[0].warnings)
        self.assertIn("regional average", plan.stops[0].warnings)

    def test_forced_early_stop_is_marked_when_no_preferred_stop_is_available(self):
        vehicle = Vehicle("test", 10, 10)
        policy = RangePolicy(
            latest_stop_miles_left=0,
            earliest_stop_tank_fraction=0.25,
            max_station_detour_miles=5,
        )
        stations = [
            Station("early", "Early Rescue", "A", "A", 0, 0, 60, 1, 4.00),
            Station("next", "Next Reachable", "C", "C", 0, 0, 140, 1, 4.00),
        ]

        plan = plan_fuel_stops(
            {"total_miles": 220},
            stations,
            vehicle,
            policy,
            initial_tank_fraction=1.0,
        )

        self.assertEqual([stop.station.name for stop in plan.stops], ["Early Rescue", "Next Reachable"])
        self.assertTrue(plan.stops[0].forced_early_stop)

    def test_fixture_segments_do_not_exceed_usable_range(self):
        vehicle = Vehicle("2014 Subaru Outback Premium 6MT", 16.9, 22.2)
        policy = RangePolicy(latest_stop_miles_left=40, earliest_stop_tank_fraction=0.25)
        stations = [
            Station("a", "Riverton", "A", "A", 0, 0, 328, 1, 3.39),
            Station("b", "West Yellowstone", "B", "B", 0, 0, 620, 1, 3.89),
            Station("c", "Stanley", "C", "C", 0, 0, 929, 1, 4.10, is_average=True),
            Station("d", "Rock Springs", "D", "D", 0, 0, 1248, 1, 3.49),
            Station("e", "Silverthorne", "E", "E", 0, 0, 1536, 1, 4.19),
        ]

        plan = plan_fuel_stops(
            {"total_miles": 1604},
            stations,
            vehicle,
            policy,
            initial_tank_fraction=1.0,
        )

        self.assertTrue(plan.segment_miles)
        self.assertLessEqual(max(plan.segment_miles), policy.usable_range_miles(vehicle))

    def test_provider_geometry_gets_cumulative_mileage(self):
        geometry = geometry_with_cumulative_miles([
            [-104.9903, 39.7392],
            [-104.9903, 40.7392],
        ])

        self.assertEqual(geometry[0]["mile"], 0)
        self.assertGreater(geometry[1]["mile"], 60)


if __name__ == "__main__":
    unittest.main()
