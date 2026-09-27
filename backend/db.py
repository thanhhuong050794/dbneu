"""
db.py
------
Quan ly ket noi toi MongoDB cho toan bo backend.
Chi can sua bien MONGO_URI (hoac dat trong file .env) neu MongoDB
chay o may khac / co user-password / dung MongoDB Atlas.
"""

import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()  # doc file .env neu co

# ----- CAU HINH KET NOI MONGODB -----
# Vi du khac:
#   MongoDB local khong auth : mongodb://localhost:27017/
#   MongoDB co user/pass     : mongodb://user:password@localhost:27017/
#   MongoDB Atlas (cloud)    : mongodb+srv://user:password@cluster.mongodb.net/
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
DB_NAME = os.getenv("MONGO_DB_NAME", "neu_admissions")

_client = None


def get_client():
    global _client
    if _client is None:
        _client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    return _client


def get_db():
    """Tra ve database object de cac module khac dung chung."""
    return get_client()[DB_NAME]


# Ten cac collection - dat thanh hang so de dung nhat quan trong toan bo project
COL_CONTACTS = "contacts"              # Master_Contacts -> khoa chinh: contact_id
COL_SIGNUPS = "signups"                # Main_Signups_Clean
COL_EXTERNAL_LEADS = "external_leads"  # External_Leads_Clean
COL_DUPLICATE_LOG = "duplicate_log"    # Duplicate_Log
COL_DATA_QUALITY = "data_quality"      # Data_Quality
COL_DRIP_SEGMENTS = "drip_segments"    # Drip_Segments
COL_EXAM_LIST = "exam_list"            # Bang B - Ha Noi + Bang B - TP.HCM (gop chung, co field "city")


def check_connection():
    """Goi khi khoi dong app de kiem tra ket noi Mongo, tra ve (True, msg) hoac (False, msg)."""
    try:
        get_client().admin.command("ping")
        return True, f"Ket noi MongoDB thanh cong ({MONGO_URI}), database='{DB_NAME}'"
    except Exception as e:
        return False, f"KHONG the ket noi MongoDB tai {MONGO_URI}: {e}"
