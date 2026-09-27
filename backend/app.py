"""
app.py
------
Flask backend cho ung dung BI truc quan hoa du lieu tuyen sinh (NEU/PTIT).
Chay: python app.py
Mac dinh phuc vu tai: http://localhost:5000
"""

import os
from flask import Flask, jsonify, request, send_file, send_from_directory
from flask_cors import CORS

import queries as q
from db import check_connection
from export_utils import export_excel, export_word, export_pdf

FRONTEND_DIR = os.path.join(os.path.dirname(__file__), "..", "frontend")

app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path="")
CORS(app)


# ---------------------------------------------------------------------------
# Phuc vu giao dien tinh (HTML/CSS/JS)
# ---------------------------------------------------------------------------
@app.route("/")
def index():
    return send_from_directory(FRONTEND_DIR, "index.html")


# ---------------------------------------------------------------------------
# API: he thong
# ---------------------------------------------------------------------------
@app.route("/api/health")
def health():
    ok, msg = check_connection()
    return jsonify({"ok": ok, "message": msg})


# ---------------------------------------------------------------------------
# API: KPI va bieu do
# ---------------------------------------------------------------------------
@app.route("/api/summary")
def api_summary():
    return jsonify(q.kpi_summary())


@app.route("/api/charts/region")
def api_chart_region():
    return jsonify(q.group_count("region"))


@app.route("/api/charts/school")
def api_chart_school():
    return jsonify(q.group_count("school"))


@app.route("/api/charts/payment-status")
def api_chart_payment():
    return jsonify(q.group_count("payment_status"))


@app.route("/api/charts/segment")
def api_chart_segment():
    return jsonify(q.group_count("segment_name"))


@app.route("/api/charts/source")
def api_chart_source():
    return jsonify(q.source_breakdown())


@app.route("/api/charts/revenue-by-region")
def api_revenue_region():
    return jsonify(q.revenue_by_region())


@app.route("/api/charts/timeline")
def api_timeline():
    return jsonify(q.registrations_timeline())


@app.route("/api/charts/data-quality")
def api_data_quality():
    return jsonify(q.data_quality_overview())


@app.route("/api/charts/exam-by-city")
def api_exam_city():
    return jsonify(q.exam_list_by_city())


@app.route("/api/drip-segments")
def api_drip_segments():
    return jsonify(q.drip_segments_overview())


# ---------------------------------------------------------------------------
# API: bang du lieu chi tiet (co loc + phan trang)
# ---------------------------------------------------------------------------
@app.route("/api/contacts")
def api_contacts():
    filters = {
        "region": request.args.get("region"),
        "payment_status": request.args.get("payment_status"),
        "segment_code": request.args.get("segment_code"),
        "search": request.args.get("search"),
    }
    page = int(request.args.get("page", 1))
    page_size = int(request.args.get("page_size", 20))
    return jsonify(q.list_contacts(filters, page, page_size))


# ---------------------------------------------------------------------------
# API: xuat bao cao
# ---------------------------------------------------------------------------
@app.route("/api/export/excel")
def api_export_excel():
    path = export_excel()
    return send_file(path, as_attachment=True)


@app.route("/api/export/word")
def api_export_word():
    path = export_word()
    return send_file(path, as_attachment=True)


@app.route("/api/export/pdf")
def api_export_pdf():
    path = export_pdf()
    return send_file(path, as_attachment=True)


if __name__ == "__main__":
    ok, msg = check_connection()
    print(msg)
    if not ok:
        print("!! Backend van khoi dong nhung API se loi neu MongoDB chua chay.")
        print("!! Xem README.md de biet cach cai dat / khoi dong MongoDB.")
    app.run(host="0.0.0.0", port=5000, debug=True)
