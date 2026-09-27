"""
queries.py
----------
Tat ca cac truy van (query) / aggregation pipeline MongoDB dung cho dashboard BI.
Tach rieng file nay de app.py (route Flask) gon gang va de kiem thu doc lap.
"""

from db import get_db, COL_CONTACTS, COL_EXAM_LIST, COL_DRIP_SEGMENTS, COL_DATA_QUALITY


def kpi_summary():
    db = get_db()
    col = db[COL_CONTACTS]

    total_contacts = col.count_documents({})
    paid = col.count_documents({"payment_status": {"$regex": "thanh toán", "$options": "i"}})
    total_fee = list(col.aggregate([
        {"$match": {"fee": {"$type": "number"}}},
        {"$group": {"_id": None, "total": {"$sum": "$fee"}}}
    ]))
    total_fee = total_fee[0]["total"] if total_fee else 0

    need_check = col.count_documents({"need_check_flag": {"$ne": None}})
    total_signup_web = col.count_documents({"registered_web": {"$regex": "^Có$", "$options": "i"}})

    return {
        "total_contacts": total_contacts,
        "paid_contacts": paid,
        "unpaid_contacts": total_contacts - paid,
        "total_revenue": total_fee,
        "need_check_count": need_check,
        "web_registered_count": total_signup_web,
    }


def group_count(field, limit=20):
    """Dem so contact theo 1 truong bat ky (vd: region, school, segment_name, payment_status)."""
    db = get_db()
    pipeline = [
        {"$group": {"_id": f"${field}", "count": {"$sum": 1}}},
        {"$match": {"_id": {"$ne": None}}},
        {"$sort": {"count": -1}},
        {"$limit": limit},
    ]
    result = list(db[COL_CONTACTS].aggregate(pipeline))
    return [{"label": r["_id"], "count": r["count"]} for r in result]


def revenue_by_region():
    db = get_db()
    pipeline = [
        {"$match": {"fee": {"$type": "number"}, "region": {"$ne": None}}},
        {"$group": {"_id": "$region", "revenue": {"$sum": "$fee"}, "count": {"$sum": 1}}},
        {"$sort": {"revenue": -1}},
    ]
    result = list(db[COL_CONTACTS].aggregate(pipeline))
    return [{"label": r["_id"], "revenue": r["revenue"], "count": r["count"]} for r in result]


def registrations_timeline():
    """So dang ky web theo ngay, dua tren truong web_register_at (ISO string)."""
    db = get_db()
    pipeline = [
        {"$match": {"web_register_at": {"$ne": None}}},
        {"$project": {"day": {"$substrCP": ["$web_register_at", 0, 10]}}},
        {"$group": {"_id": "$day", "count": {"$sum": 1}}},
        {"$sort": {"_id": 1}},
    ]
    result = list(db[COL_CONTACTS].aggregate(pipeline))
    return [{"date": r["_id"], "count": r["count"]} for r in result]


def source_breakdown():
    """Contact den tu nguon nao (Website / Talkshow / FB Lead Form...), 1 nguoi co the co nhieu nguon."""
    db = get_db()
    pipeline = [
        {"$match": {"data_sources": {"$ne": None}}},
        {"$project": {"sources": {"$split": ["$data_sources", ", "]}}},
        {"$unwind": "$sources"},
        {"$group": {"_id": "$sources", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
    ]
    result = list(db[COL_CONTACTS].aggregate(pipeline))
    return [{"label": r["_id"], "count": r["count"]} for r in result]


def drip_segments_overview():
    db = get_db()
    docs = list(db[COL_DRIP_SEGMENTS].find({}, {"_id": 0}))
    return docs


def data_quality_overview():
    db = get_db()
    pipeline = [
        {"$group": {"_id": "$issue_type", "count": {"$sum": 1}}},
        {"$match": {"_id": {"$ne": None}}},
        {"$sort": {"count": -1}},
    ]
    return [{"label": r["_id"], "count": r["count"]} for r in db[COL_DATA_QUALITY].aggregate(pipeline)]


def exam_list_by_city():
    db = get_db()
    pipeline = [
        {"$group": {"_id": "$city", "count": {"$sum": 1}}},
    ]
    return [{"label": r["_id"], "count": r["count"]} for r in db[COL_EXAM_LIST].aggregate(pipeline)]


def list_contacts(filters=None, page=1, page_size=20):
    """Tra ve danh sach contact co phan trang + loc, dung cho bang du lieu chi tiet tren giao dien."""
    db = get_db()
    query = {}
    filters = filters or {}
    if filters.get("region"):
        query["region"] = filters["region"]
    if filters.get("payment_status"):
        query["payment_status"] = filters["payment_status"]
    if filters.get("segment_code"):
        query["segment_code"] = filters["segment_code"]
    if filters.get("search"):
        s = filters["search"]
        query["$or"] = [
            {"full_name": {"$regex": s, "$options": "i"}},
            {"email": {"$regex": s, "$options": "i"}},
            {"contact_id": {"$regex": s, "$options": "i"}},
        ]

    total = db[COL_CONTACTS].count_documents(query)
    cursor = (
        db[COL_CONTACTS]
        .find(query, {"_id": 0})
        .sort("contact_id", 1)
        .skip((page - 1) * page_size)
        .limit(page_size)
    )
    return {"total": total, "page": page, "page_size": page_size, "items": list(cursor)}


def all_contacts_for_export(filters=None):
    db = get_db()
    query = {}
    filters = filters or {}
    if filters.get("region"):
        query["region"] = filters["region"]
    if filters.get("payment_status"):
        query["payment_status"] = filters["payment_status"]
    return list(db[COL_CONTACTS].find(query, {"_id": 0}).sort("contact_id", 1))
