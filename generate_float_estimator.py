from pathlib import Path
import sys

sys.path.insert(0, "/private/tmp/weather-xlsxwriter")
import xlsxwriter


out = Path(__file__).with_name("Colorado_River_Float_Time_Estimator.xlsx")
workbook = xlsxwriter.Workbook(out)
workbook.set_properties(
    {
        "title": "Colorado River Float Time Estimator",
        "subject": "Rough float-time estimate based on CFS",
        "author": "OpenAI",
    }
)

title = workbook.add_format(
    {"bold": True, "font_size": 18, "font_color": "white", "bg_color": "#1F4E78"}
)
section = workbook.add_format(
    {"bold": True, "font_size": 12, "font_color": "white", "bg_color": "#1F4E78"}
)
label = workbook.add_format({"bg_color": "#D9EAF7", "border": 1})
input_num = workbook.add_format(
    {"bg_color": "#FFF2CC", "border": 1, "num_format": "0.00"}
)
input_int = workbook.add_format({"bg_color": "#FFF2CC", "border": 1, "num_format": "0"})
result_num = workbook.add_format(
    {"bg_color": "#D9EAF7", "border": 1, "num_format": "0.00"}
)
result_time = workbook.add_format(
    {"bg_color": "#D9EAF7", "border": 1, "num_format": "[h]:mm"}
)
header = workbook.add_format(
    {"bold": True, "font_color": "white", "bg_color": "#1F4E78", "border": 1}
)
table_int = workbook.add_format({"bg_color": "#FFF2CC", "border": 1, "num_format": "0"})
note = workbook.add_format({"italic": True, "font_color": "#555555", "text_wrap": True})
wrap = workbook.add_format({"text_wrap": True, "valign": "top"})

ws = workbook.add_worksheet("Float Estimator")
ws.set_column("A:A", 48)
ws.set_column("B:C", 20)
ws.freeze_panes(3, 0)
ws.merge_range("A1:C1", "Colorado River Float Time Estimator", title)
ws.merge_range("A2:C2", "Calibrated from a Deschutes River float; edit yellow cells.", note)

def section_row(cell, text):
    ws.merge_range(cell, text, section)

section_row("A4:C4", "Calibration Inputs")
calibration = [
    ("A5", "Deschutes distance (miles)", "B5", 1.96, input_num),
    ("A6", "Deschutes time (hours)", "B6", 1.75, input_num),
    ("A7", "Deschutes average flow (CFS)", "B7", 116, input_int),
]
for label_cell, text, value_cell, value, fmt in calibration:
    ws.write(label_cell, text, label)
    ws.write(value_cell, value, fmt)
ws.write("A8", "Calibrated speed (mph)", label)
ws.write_formula("B8", "=B5/B6", result_num)

section_row("A10:C10", "Colorado Trip Inputs")
ws.write("A11", "Riverbend Park to Corn Lake distance (miles)", label)
ws.write("B11", 7, input_num)
ws.write("A12", "Colorado River flow that day (CFS)", label)
ws.write("B12", 650, input_int)
ws.write("A13", "Speed adjustment factor", label)
ws.write("B13", 1, input_num)

section_row("A15:C15", "Estimated Results")
ws.write("A16", "Estimated float speed (mph)", label)
ws.write_formula("B16", "=B8*(B12/B7)*B13", result_num)
ws.write("A17", "Estimated float time (decimal hours)", label)
ws.write_formula("B17", "=B11/B16", result_num)
ws.write("A18", "Estimated float time (hours:minutes)", label)
ws.write_formula("B18", "=B17/24", result_time)

section_row("A20:C20", "CFS Scenarios")
for col, text in enumerate(["Colorado CFS", "Estimated Hours", "Estimated Time"]):
    ws.write(20, col, text, header)

flows = [100, 150, 200, 300, 400, 500, 650, 800, 1000, 1250, 1500, 2000, 3000]
for row, flow in enumerate(flows, start=21):
    excel_row = row + 1
    ws.write(row, 0, flow, table_int)
    ws.write_formula(row, 1, f"=$B$11/($B$8*(A{excel_row}/$B$7)*$B$13)", result_num)
    ws.write_formula(row, 2, f"=B{excel_row}/24", result_time)

chart = workbook.add_chart({"type": "line"})
chart.add_series(
    {
        "name": "Estimated Hours",
        "categories": "='Float Estimator'!$A$22:$A$34",
        "values": "='Float Estimator'!$B$22:$B$34",
        "line": {"color": "#1F4E78", "width": 2.25},
    }
)
chart.set_title({"name": "Estimated Float Time by CFS"})
chart.set_x_axis({"name": "Colorado River Flow (CFS)"})
chart.set_y_axis({"name": "Estimated Hours", "min": 0})
chart.set_legend({"none": True})
ws.insert_chart("E4", chart, {"x_scale": 1.15, "y_scale": 1.15})

notes = workbook.add_worksheet("Method & Notes")
notes.set_column("A:A", 115)
notes.write("A1", "Method & Notes", title)
entries = [
    (2, "Core formula", section),
    (3, "Estimated speed = Deschutes speed x (Colorado CFS / Deschutes CFS) x adjustment factor", wrap),
    (5, "Important limitation", section),
    (6, "This assumes speed changes linearly with CFS across two different rivers. It is a rough planning assumption, not a hydraulic model.", wrap),
    (8, "Route distance", section),
    (9, "The default Riverbend Park to Corn Lake distance is 7 miles, a commonly reported approximate river distance. Edit it if you have a measured GPS track.", wrap),
    (11, "Adjustment factor", section),
    (12, "Use less than 1.0 for slower travel caused by wind, shallow sections, eddies, stops, or a slower craft. Use greater than 1.0 for active paddling.", wrap),
    (14, "Safety", section),
    (15, "CFS alone does not determine safety. Check current conditions, weather, hazards, access status, and local guidance before launching.", wrap),
]
for row, text, fmt in entries:
    notes.write(row, 0, text, fmt)
    if fmt is wrap:
        notes.set_row(row, 35)

workbook.close()
print(out)
