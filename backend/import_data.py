"""
import_data.py
---------------
Doc du lieu tu file Excel da lam sach (NEU_CaseStudy_Booklet2_Cleaned_Answer_Key.xlsx)
va nap vao MongoDB.

Cach chay:
    cd backend
    python import_data.py

File Excel can duoc dat trong thu muc ../data/ (da copy san).
Neu muon dung file khac, sua bien SOURCE_FILE ben duoi hoac truyen tham so:
    python import_data.py "duong/dan/file.xlsx"

Khoa chinh:
    - Collection 'contacts'   : _id = contact_id   (vi du "PT-001")
    - Collection 'exam_list'  : _id = contact_id, them field 'city' (Ha Noi / TP.HCM)
    - Cac collection con lai khong co khoa tu nhien ro rang nen de MongoDB
      tu sinh ObjectId, nhung van giu cot contact_id/orig_row de doi chieu.
"""

import sys
import datetime
import openpyxl
from pymongo import UpdateOne

from db import (
    get_db,
    COL_CONTACTS,
    COL_SIGNUPS,
    COL_EXTERNAL_LEADS,
    COL_DUPLICATE_LOG,
    COL_DATA_QUALITY,
    COL_DRIP_SEGMENTS,
    COL_EXAM_LIST,
    check_connection,
)

DEFAULT_SOURCE = "../data/NEU_CaseStudy_Booklet2_Cleaned_Answer_Key.xlsx"


def slugify_key(v):
    """Khong dung trong file nay nhung de lai neu can chuan hoa ten cot tu dong."""
    return str(v).strip().lower().replace(" ", "_")


def clean_value(v):
    """Chuyen datetime -> isoformat string de luu Mongo/JSON de dang; None giu nguyen."""
    if isinstance(v, (datetime.datetime, datetime.date)):
        return v.isoformat()
    if isinstance(v, str):
        v = v.strip()
        return v if v != "" else None
    return v


def read_rows(ws, header_row, first_data_row, field_names):
    """Doc cac dong tu 'first_data_row' toi het sheet, map theo field_names.
    Dung lai khi gap dong hoan toan rong."""
    rows = []
    for row in ws.iter_rows(min_row=first_data_row, values_only=True):
        if row is None or all(c is None for c in row):
            continue
        doc = {}
        for i, fname in enumerate(field_names):
            if fname is None:
                continue
            val = row[i] if i < len(row) else None
            doc[fname] = clean_value(val)
        rows.append(doc)
    return rows


def import_contacts(wb, db):
    ws = wb["Master_Contacts"]
    fields = [
        "contact_id", "full_name", "email", "phone", "group_table", "region",
        "school", "registered_web", "payment_status", "fee",
        "has_talkshow_fb_interaction", "talkshow_google_form", "fb_lead_form",
        "want_talkshow_schedule", "question_interest", "self_declared_registered",
        "merged_record_count", "raw_row_count_in_data", "data_sources",
        "first_contact_at", "web_register_at", "segment_code", "segment_name",
        "sub_segment", "drip_campaign", "need_check_flag", "pic", "merge_note",
    ]
    docs = read_rows(ws, 9, 10, fields)

    ops = []
    for d in docs:
        if not d.get("contact_id"):
            continue
        d["_id"] = d["contact_id"]
        ops.append(UpdateOne({"_id": d["_id"]}, {"$set": d}, upsert=True))

    if ops:
        db[COL_CONTACTS].bulk_write(ops)
    print(f"  -> contacts: {len(ops)} ban ghi (khoa chinh: contact_id)")


def import_signups(wb, db):
    ws = wb["Main_Signups_Clean"]
    fields = [
        "orig_row", "contact_id", "keep_or_duplicate", "registered_at",
        "full_name_std", "full_name_orig", "email_std", "email_orig",
        "phone_std", "phone_orig", "group_table", "region_std",
        "school_std", "school_orig", "dob", "id_number", "fee",
        "payment_status", "partner", "promo_code", "pic", "note",
    ]
    docs = read_rows(ws, 8, 9, fields)
    if docs:
        db[COL_SIGNUPS].delete_many({})
        db[COL_SIGNUPS].insert_many(docs)
    print(f"  -> signups: {len(docs)} ban ghi")


def import_external_leads(wb, db):
    ws = wb["External_Leads_Clean"]
    fields = [
        "source", "orig_row", "contact_id", "clean_result", "segment",
        "submitted_at", "full_name_std", "full_name_orig", "email_std",
        "email_orig", "phone_std", "phone_orig", "table_interest",
        "region_std", "school_orig", "want_talkshow_schedule",
        "self_declared_registered", "question", "campaign_channel",
        "pic", "note",
    ]
    docs = read_rows(ws, 8, 9, fields)
    if docs:
        db[COL_EXTERNAL_LEADS].delete_many({})
        db[COL_EXTERNAL_LEADS].insert_many(docs)
    print(f"  -> external_leads: {len(docs)} ban ghi")


def import_duplicate_log(wb, db):
    ws = wb["Duplicate_Log"]
    fields = ["source", "orig_row", "contact_id", "full_name_orig",
              "email_orig", "payment_status", "reason"]
    docs = read_rows(ws, 7, 8, fields)
    if docs:
        db[COL_DUPLICATE_LOG].delete_many({})
        db[COL_DUPLICATE_LOG].insert_many(docs)
    print(f"  -> duplicate_log: {len(docs)} ban ghi")


def import_data_quality(wb, db):
    ws = wb["Data_Quality"]
    fields = ["issue_type", "source", "orig_row", "original_value",
              "standardized_value", "note"]
    docs = read_rows(ws, 7, 8, fields)
    if docs:
        db[COL_DATA_QUALITY].delete_many({})
        db[COL_DATA_QUALITY].insert_many(docs)
    print(f"  -> data_quality: {len(docs)} ban ghi")


def import_drip_segments(wb, db):
    ws = wb["Drip_Segments"]
    fields = ["drip", "segment", "entry_condition", "goal",
              "exit_condition", "contact_count", "sendable_count"]
    docs = read_rows(ws, 7, 8, fields)
    if docs:
        db[COL_DRIP_SEGMENTS].delete_many({})
        db[COL_DRIP_SEGMENTS].insert_many(docs)
    print(f"  -> drip_segments: {len(docs)} ban ghi")


def import_exam_list(wb, db):
    fields = ["stt", "contact_id", "full_name", "dob", "id_number", "email",
              "phone", "group_table", "school", "region", "payment_status",
              "fee", "exam_location", "exam_date", "exam_time", "note"]
    sheet_city = [
        ("Bảng B – Hà Nội", "Ha Noi"),
        ("Bảng B – TP.HCM", "TP.HCM"),
    ]
    all_docs = []
    for sheet_name, city in sheet_city:
        ws = wb[sheet_name]
        docs = read_rows(ws, 8, 9, fields)
        for d in docs:
            d["city"] = city
        all_docs.extend(docs)

    ops = []
    for d in all_docs:
        key = d.get("contact_id") or f"{d.get('city')}-{d.get('stt')}"
        d["_id"] = key
        ops.append(UpdateOne({"_id": key}, {"$set": d}, upsert=True))
    if ops:
        db[COL_EXAM_LIST].bulk_write(ops)
    print(f"  -> exam_list: {len(ops)} ban ghi (Ha Noi + TP.HCM)")


def create_indexes(db):
    db[COL_CONTACTS].create_index("email")
    db[COL_CONTACTS].create_index("region")
    db[COL_CONTACTS].create_index("payment_status")
    db[COL_CONTACTS].create_index("segment_code")
    db[COL_EXAM_LIST].create_index("city")
    print("  -> Da tao index tren cac truong hay dung de loc/query (email, region, payment_status, segment_code, city)")


def main():
    source_file = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_SOURCE

    ok, msg = check_connection()
    print(msg)
    if not ok:
        print("Hay cai dat va khoi dong MongoDB truoc khi chay import (xem README.md).")
        sys.exit(1)

    print(f"Dang doc file Excel: {source_file}")
    wb = openpyxl.load_workbook(source_file, data_only=True)
    db = get_db()

    print("Bat dau nap du lieu vao MongoDB...")
    import_contacts(wb, db)
    import_signups(wb, db)
    import_external_leads(wb, db)
    import_duplicate_log(wb, db)
    import_data_quality(wb, db)
    import_drip_segments(wb, db)
    import_exam_list(wb, db)
    create_indexes(db)

    print("\nHoan tat! Du lieu da san sang trong database 'neu_admissions'.")
    print("Chay 'python app.py' de khoi dong backend BI.")


if __name__ == "__main__":
    main()
