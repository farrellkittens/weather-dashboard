from pathlib import Path
import sys

sys.path.insert(0, "/private/tmp/weather-xlsxwriter")
import xlsxwriter


OUT = Path(__file__).with_name("Colorado_River_Float_Time_Estimator.xlsx")

MONTHLY_FLOWS = [
    ("January", 1380, 1262, 1538),
    ("February", 1345, 1200, 1480),
    ("March", 1480, 1340, 1650),
    ("April", 1330, 1040, 1770),
    ("May", 4165, 2302, 7370),
    ("June", 5495, 3105, 11500),
    ("July", 938, 610, 2038),
    ("August", 696, 449, 1010),
    ("September", 696, 484, 949),
    ("October", 878, 713, 1242),
    ("November", 1505, 1370, 1760),
    ("December", 1320, 1210, 1528),
]

SCENARIO_FLOWS = [100, 150, 200, 300, 400, 500, 650, 800, 1000, 1250, 1500, 2000, 3000, 5000, 8000]


workbook = xlsxwriter.Workbook(OUT)
workbook.set_properties(
    {
        "title": "Colorado River Float Time Estimator",
        "subject": "Palisade to Corn Lake float-time estimate based on local guidance and CFS",
        "author": "OpenAI",
    }
)

title = workbook.add_format({"bold": True, "font_size": 18, "font_color": "white", "bg_color": "#1F4E78"})
section = workbook.add_format({"bold": True, "font_size": 12, "font_color": "white", "bg_color": "#1F4E78"})
label = workbook.add_format({"bg_color": "#D9EAF7", "border": 1})
input_num = workbook.add_format({"bg_color": "#FFF2CC", "border": 1, "num_format": "0.00"})
input_int = workbook.add_format({"bg_color": "#FFF2CC", "border": 1, "num_format": "0"})
result_num = workbook.add_format({"bg_color": "#E2F0D9", "border": 1, "num_format": "0.00"})
result_time = workbook.add_format({"bg_color": "#E2F0D9", "border": 1, "num_format": "[h]:mm"})
warn = workbook.add_format({"bg_color": "#FCE4D6", "border": 1, "text_wrap": True})
header = workbook.add_format({"bold": True, "font_color": "white", "bg_color": "#1F4E78", "border": 1})
cell = workbook.add_format({"border": 1})
cell_int = workbook.add_format({"border": 1, "num_format": "0"})
cell_num = workbook.add_format({"border": 1, "num_format": "0.00"})
cell_time = workbook.add_format({"border": 1, "num_format": "[h]:mm"})
note = workbook.add_format({"italic": True, "font_color": "#555555", "text_wrap": True})
wrap = workbook.add_format({"text_wrap": True, "valign": "top"})


def add_main_sheet():
    ws = workbook.add_worksheet("Float Estimator")
    ws.set_column("A:A", 52)
    ws.set_column("B:D", 20)
    ws.set_column("F:J", 17)
    ws.freeze_panes(3, 0)

    ws.merge_range("A1:D1", "Colorado River Float Time Estimator", title)
    ws.merge_range(
        "A2:D2",
        "Rebuilt around Colorado-specific Palisade guidance and USGS gauge 09106150.",
        note,
    )

    ws.merge_range("A4:D4", "Colorado Reach Inputs", section)
    inputs = [
        ("A5", "Route distance, Riverbend Park to Corn Lake (miles)", "B5", 6.5, input_num),
        ("A6", "Observed/advised baseline CFS for this reach", "B6", 650, input_int),
        ("A7", "Observed/advised baseline float time (hours)", "B7", 2.5, input_num),
        ("A8", "Flow sensitivity exponent", "B8", 0.35, input_num),
        ("A9", "Your day's Colorado River CFS", "B9", 650, input_int),
        ("A10", "Trip style factor", "B10", 1, input_num),
    ]
    for label_cell, text, value_cell, value, fmt in inputs:
        ws.write(label_cell, text, label)
        ws.write(value_cell, value, fmt)

    ws.write("C8", "Lower = CFS changes time less aggressively; 0.35 is a conservative hydraulic-geometry-style default.", note)
    ws.write("C10", "Use >1 for slower tubing/stops/headwind; <1 for active paddling.", note)

    ws.merge_range("A12:D12", "Estimated Results", section)
    ws.write("A13", "Estimated float time (decimal hours)", label)
    ws.write_formula("B13", "=$B$7*($B$6/$B$9)^$B$8*$B$10", result_num)
    ws.write("A14", "Estimated float time (hours:minutes)", label)
    ws.write_formula("B14", "=B13/24", result_time)
    ws.write("A15", "Estimated average speed (mph)", label)
    ws.write_formula("B15", "=$B$5/$B$13", result_num)
    ws.write("A16", "Local-advice check", label)
    ws.write(
        "B16",
        "Most public/local guidance clusters around 2-3.5 hours. If this result is far outside that, treat the model as suspect.",
        warn,
    )

    ws.merge_range("A18:D18", "Why the Deschutes-Only Assumption Was Rejected", section)
    ws.write("A19", "Deschutes distance (miles)", label)
    ws.write("B19", 1.96, input_num)
    ws.write("A20", "Deschutes time (hours)", label)
    ws.write("B20", 1.75, input_num)
    ws.write("A21", "Deschutes average CFS", label)
    ws.write("B21", 116, input_int)
    ws.write("A22", "Deschutes-linear estimate for Colorado at your CFS", label)
    ws.write_formula("B22", "=$B$5/(($B$19/$B$20)*($B$9/$B$21))", result_num)
    ws.write("C22", "This was the original assumption. It underpredicts local advised float times, so it is kept only as a comparison.", warn)

    ws.merge_range("F4:J4", "CFS Scenarios", section)
    for col, text in enumerate(["CFS", "Model Hours", "Model Time", "Deschutes-Linear Hours", "Notes"], start=5):
        ws.write(4, col, text, header)
    for row, flow in enumerate(SCENARIO_FLOWS, start=5):
        excel_row = row + 1
        ws.write(row, 5, flow, cell_int)
        ws.write_formula(row, 6, f"=$B$7*($B$6/F{excel_row})^$B$8*$B$10", cell_num)
        ws.write_formula(row, 7, f"=G{excel_row}/24", cell_time)
        ws.write_formula(row, 8, f"=$B$5/(($B$19/$B$20)*(F{excel_row}/$B$21))", cell_num)
        ws.write(row, 9, "", cell)

    chart = workbook.add_chart({"type": "line"})
    chart.add_series(
        {
            "name": "Colorado-calibrated model",
            "categories": "='Float Estimator'!$F$6:$F$20",
            "values": "='Float Estimator'!$G$6:$G$20",
            "line": {"color": "#1F4E78", "width": 2.25},
        }
    )
    chart.add_series(
        {
            "name": "Rejected Deschutes-linear model",
            "categories": "='Float Estimator'!$F$6:$F$20",
            "values": "='Float Estimator'!$I$6:$I$20",
            "line": {"color": "#C00000", "dash_type": "dash"},
        }
    )
    chart.set_title({"name": "Palisade to Corn Lake: Estimated Hours by CFS"})
    chart.set_x_axis({"name": "Colorado River CFS"})
    chart.set_y_axis({"name": "Estimated Hours", "min": 0})
    ws.insert_chart("F22", chart, {"x_scale": 1.3, "y_scale": 1.15})


def add_season_sheet():
    ws = workbook.add_worksheet("Season Check")
    ws.set_column("A:A", 16)
    ws.set_column("B:D", 14)
    ws.set_column("E:G", 18)
    ws.set_column("I:I", 70)
    ws.merge_range("A1:G1", "Seasonal Flow Check: USGS 09106150", title)
    ws.write("A2", "Daily discharge data: 2020-01-01 through 2025-12-31.", note)
    headers = ["Month", "Median CFS", "25th % CFS", "75th % CFS", "Model Median Hours", "Model Median Time", "Local Advice Fit"]
    for col, text in enumerate(headers):
        ws.write(3, col, text, header)
    for row, (month, median, p25, p75) in enumerate(MONTHLY_FLOWS, start=4):
        excel_row = row + 1
        ws.write(row, 0, month, cell)
        ws.write(row, 1, median, cell_int)
        ws.write(row, 2, p25, cell_int)
        ws.write(row, 3, p75, cell_int)
        ws.write_formula(row, 4, f"='Float Estimator'!$B$7*('Float Estimator'!$B$6/B{excel_row})^'Float Estimator'!$B$8*'Float Estimator'!$B$10", cell_num)
        ws.write_formula(row, 5, f"=E{excel_row}/24", cell_time)
        ws.write_formula(row, 6, f'=IF(E{excel_row}<2,"Faster than typical advice",IF(E{excel_row}>3.5,"Slower than typical advice","Within typical 2-3.5 hr advice"))', cell)

    ws.write("I4", "Takeaway", section)
    ws.write(
        "I5",
        "The relevant Colorado gauge usually shows much higher flows than the Deschutes example, but local Palisade advice still says this float commonly takes about 2-3.5 hours. That means the workbook should not scale speed linearly from the Deschutes CFS. The revised model uses Colorado-specific baseline time and a dampened flow exponent.",
        wrap,
    )
    ws.set_row(4, 90)


def add_notes_sheet():
    ws = workbook.add_worksheet("Sources & Notes")
    ws.set_column("A:A", 120)
    ws.write("A1", "Sources & Notes", title)
    rows = [
        ("A3", "Key correction", section),
        ("A4", "CFS is river discharge, not float speed. Comparing 116 CFS on the Deschutes directly to 650+ CFS on the Colorado ignores river width, depth, slope, channel shape, and diversions.", wrap),
        ("A6", "Local time guidance found", section),
        ("A7", "Visit Palisade: Riverbend Park/Harky's Launch to Corn Lake takes 2-3 hours depending on flow and speed.", wrap),
        ("A8", "Palisade River Trips: the same scenic trip takes 2.5-3.5 hours depending on river flow.", wrap),
        ("A9", "The Gear Junction: lists Riverbend Park to Corn Lake as 6.5 river miles.", wrap),
        ("A10", "Denver Gazette/Float Palisade reporting: Riverbend Park to Corn Lake is a popular route that might last about 2 hours.", wrap),
        ("A12", "Flow data used", section),
        ("A13", "USGS site 09106150, COLO RIVER BELOW GRAND VALLEY DIV NR PALISADE, CO. The seasonal table uses daily discharge values from 2020-01-01 through 2025-12-31.", wrap),
        ("A15", "Model", section),
        ("A16", "Default estimate = baseline Colorado time x (baseline CFS / current CFS) ^ exponent x trip style factor. Defaults: 2.5 hours at 650 CFS, exponent 0.35, trip factor 1.0.", wrap),
        ("A18", "Safety", section),
        ("A19", "This is a planning calculator, not a safety rating. Check current USGS flow, weather, local closures, strainers, diversion structures, river temperature, and your group's ability before launching.", wrap),
    ]
    for cell_ref, text, fmt in rows:
        ws.write(cell_ref, text, fmt)


add_main_sheet()
add_season_sheet()
add_notes_sheet()
workbook.close()
print(OUT)
