# BI Dashboard — Trực quan hóa dữ liệu Tuyển sinh (NEU/PTIT)

Ứng dụng BI hoàn chỉnh: đọc dữ liệu tuyển sinh từ Excel → nạp vào **MongoDB** →
**Backend Python (Flask)** truy vấn & tổng hợp → **Frontend HTML/CSS/JS** vẽ biểu đồ →
xuất báo cáo **Excel / Word / PDF**.

```
neu_bi_app/
├── backend/
│   ├── app.py            # Flask app, định nghĩa toàn bộ API
│   ├── db.py             # Kết nối MongoDB (SỬA URI Ở ĐÂY nếu cần)
│   ├── import_data.py    # Script đọc Excel -> nạp vào MongoDB
│   ├── queries.py         # Các câu truy vấn/aggregation MongoDB dùng cho dashboard
│   ├── export_utils.py   # Sinh báo cáo Excel/Word/PDF
│   ├── requirements.txt
│   └── .env.example      # Mẫu cấu hình (đổi tên thành .env nếu cần)
├── frontend/
│   ├── index.html        # Giao diện dashboard
│   ├── style.css
│   └── app.js             # Gọi API, vẽ biểu đồ bằng Chart.js
├── data/                  # File Excel gốc (đã copy sẵn từ bạn upload)
└── exports/                # Nơi lưu các file báo cáo xuất ra (Excel/Word/PDF)
```

---

## 1. Kiến trúc & luồng dữ liệu

```
Excel (Booklet2_Cleaned_Answer_Key.xlsx)
        │  import_data.py (đọc bằng openpyxl)
        ▼
   MongoDB  (database: neu_admissions)
    ├── contacts        (khóa chính _id = contact_id, vd "PT-001")  ← Master_Contacts
    ├── signups                                                    ← Main_Signups_Clean
    ├── external_leads                                              ← External_Leads_Clean
    ├── duplicate_log                                                ← Duplicate_Log
    ├── data_quality                                                  ← Data_Quality
    ├── drip_segments                                                 ← Drip_Segments
    └── exam_list       (_id = contact_id, field "city")             ← Bảng B Hà Nội + TP.HCM
        │  queries.py (aggregation pipeline)
        ▼
   Flask API (app.py)  --  http://localhost:5000/api/...
        │  fetch() bằng JavaScript
        ▼
   Giao diện Dashboard (frontend/index.html + Chart.js)
        │
        ▼
   Nút "Xuất báo cáo" -> gọi /api/export/excel | /word | /pdf
        -> export_utils.py truy vấn Mongo và sinh file trong thư mục exports/
```

**Vì sao chọn `contact_id` làm khóa chính cho collection `contacts`?**
File Excel đã ghi rõ: *"Contact ID (PT-001...) là khoá chính; không dùng tên hay
email làm khoá"* (vì tên/email có thể trùng hoặc viết nhiều kiểu khác nhau).
Script `import_data.py` dùng `contact_id` làm `_id` của MongoDB (upsert), nên
chạy lại import nhiều lần sẽ chỉ cập nhật chứ không tạo trùng dữ liệu.

---

## 2. Cài đặt môi trường

### Bước 1 — Cài MongoDB (nếu máy bạn chưa có)

- Windows/Mac: tải MongoDB Community Server tại
  https://www.mongodb.com/try/download/community, cài đặt và để nó chạy như
  Windows Service / macOS launchd (mặc định cổng `27017`).
- Ubuntu/Debian:
  ```bash
  sudo apt update
  sudo apt install -y mongodb
  sudo systemctl start mongodb
  sudo systemctl enable mongodb
  ```
  (Nếu bản mới dùng gói `mongodb-org`, làm theo hướng dẫn chính thức của MongoDB.)
- Hoặc dùng **Docker** (nhanh nhất, không cần cài gì thêm ngoài Docker):
  ```bash
  docker run -d --name mongo-neu -p 27017:27017 mongo:7
  ```
- Hoặc dùng **MongoDB Atlas** (cloud, miễn phí): tạo cluster free tại
  https://www.mongodb.com/cloud/atlas, lấy connection string dạng
  `mongodb+srv://user:pass@cluster.mongodb.net/` rồi dán vào file `.env`
  (xem bước 3).

Kiểm tra Mongo đã chạy chưa:
```bash
mongosh --eval "db.runCommand({ping:1})"
```

### Bước 2 — Cài Python (>= 3.9) và các thư viện

```bash
cd neu_bi_app/backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Bước 3 — (Tùy chọn) Cấu hình kết nối MongoDB

Nếu MongoDB chạy local mặc định (`mongodb://localhost:27017/`) thì **không cần**
làm gì cả — `db.py` đã có sẵn giá trị mặc định.

Nếu MongoDB của bạn có user/pass, chạy trên máy khác, hoặc dùng Atlas: sao chép
`backend/.env.example` thành `backend/.env` rồi sửa lại:
```
MONGO_URI=mongodb://user:password@host:27017/
MONGO_DB_NAME=neu_admissions
```

---

## 3. Nạp dữ liệu từ Excel vào MongoDB

```bash
cd neu_bi_app/backend
python import_data.py
```

Script sẽ đọc file `../data/NEU_CaseStudy_Booklet2_Cleaned_Answer_Key.xlsx`
(đã copy sẵn), tạo các collection trong MongoDB, và in ra số bản ghi đã nạp,
ví dụ:
```
Ket noi MongoDB thanh cong ...
  -> contacts: 145 ban ghi (khoa chinh: contact_id)
  -> signups: 132 ban ghi
  -> external_leads: 59 ban ghi
  -> duplicate_log: 46 ban ghi
  -> data_quality: ... ban ghi
  -> drip_segments: 4 ban ghi
  -> exam_list: ... ban ghi (Ha Noi + TP.HCM)
  -> Da tao index tren cac truong hay dung de loc/query
```

Muốn nạp từ file Excel khác (ví dụ bạn cập nhật dữ liệu mới), chỉ cần:
```bash
python import_data.py "duong/dan/file_moi.xlsx"
```
Script dùng cấu trúc sheet/cột giống hệt file mẫu (Master_Contacts,
Main_Signups_Clean, External_Leads_Clean, Duplicate_Log, Data_Quality,
Drip_Segments, Bảng B – Hà Nội, Bảng B – TP.HCM). Nếu file mới đổi tên sheet
hoặc thứ tự cột, cần sửa lại các hằng số dòng tiêu đề (`header_row`,
`first_data_row`) và danh sách `fields` tương ứng trong `import_data.py`.

---

## 4. Chạy backend + xem dashboard

```bash
cd neu_bi_app/backend
python app.py
```

Mở trình duyệt: **http://localhost:5000**

Bạn sẽ thấy:
- Các thẻ KPI (tổng liên hệ, đã/chưa thanh toán, tổng doanh thu...)
- Biểu đồ tròn/cột: theo khu vực, trạng thái thanh toán, trường học, segment
  marketing, nguồn tiếp cận đa kênh, doanh thu theo khu vực, đăng ký theo thời
  gian, lỗi dữ liệu, danh sách thi theo tỉnh/thành.
- Bảng Drip Segments (dùng cho email marketing).
- Bảng danh sách liên hệ chi tiết, có ô tìm kiếm + lọc theo khu vực/trạng thái
  thanh toán + phân trang.
- 3 nút xuất báo cáo: **Excel / Word / PDF** ở đầu trang.

---

## 5. Xuất báo cáo

Bấm 1 trong 3 nút trên dashboard, hoặc gọi trực tiếp API:

| Định dạng | URL |
|---|---|
| Excel (.xlsx, có biểu đồ pie/bar + sheet chi tiết) | `GET /api/export/excel` |
| Word (.docx, báo cáo dạng văn bản có bảng số liệu)  | `GET /api/export/word`  |
| PDF (.pdf, báo cáo tổng hợp)                        | `GET /api/export/pdf`   |

File sinh ra được lưu trong `neu_bi_app/exports/` và trình duyệt sẽ tự tải về
(mỗi lần bấm sẽ tạo 1 file mới có timestamp, dữ liệu luôn lấy trực tiếp từ
MongoDB tại thời điểm bấm nút).

---

## 6. Danh sách API (tham khảo / mở rộng)

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/health` | Kiểm tra kết nối MongoDB |
| GET | `/api/summary` | KPI tổng quan |
| GET | `/api/charts/region` | Số liên hệ theo khu vực |
| GET | `/api/charts/school` | Số liên hệ theo trường |
| GET | `/api/charts/payment-status` | Theo trạng thái thanh toán |
| GET | `/api/charts/segment` | Theo segment marketing |
| GET | `/api/charts/source` | Theo nguồn tiếp cận (đa kênh) |
| GET | `/api/charts/revenue-by-region` | Doanh thu theo khu vực |
| GET | `/api/charts/timeline` | Đăng ký web theo ngày |
| GET | `/api/charts/data-quality` | Thống kê lỗi dữ liệu |
| GET | `/api/charts/exam-by-city` | Danh sách thi theo tỉnh/thành |
| GET | `/api/drip-segments` | Bảng drip segment |
| GET | `/api/contacts?search=&region=&payment_status=&page=&page_size=` | Danh sách liên hệ (lọc + phân trang) |
| GET | `/api/export/excel` \| `/word` \| `/pdf` | Xuất báo cáo |

---

## 7. Xử lý sự cố thường gặp

- **"KHONG the ket noi MongoDB"**: kiểm tra MongoDB đã chạy chưa
  (`mongosh --eval "db.runCommand({ping:1})"`), kiểm tra `MONGO_URI` trong
  `backend/.env` (nếu có) hoặc trong `backend/db.py`.
- **Trang trắng / không thấy biểu đồ**: mở Console trình duyệt (F12) xem lỗi
  gọi API; đảm bảo bạn đang mở `http://localhost:5000` (do Flask serve luôn
  frontend) chứ không mở trực tiếp file `index.html` bằng `file://`.
- **Dữ liệu trống (0 liên hệ)**: bạn quên chạy `python import_data.py` trước
  khi chạy `python app.py`.
- **Muốn đổi cổng chạy**: sửa dòng cuối `app.py`,
  `app.run(host="0.0.0.0", port=5000, ...)` thành cổng bạn muốn.
- **Muốn deploy thật (không chỉ chạy local)**: dùng `gunicorn` (Linux) hoặc
  `waitress` (Windows) thay cho `debug=True`, và mở firewall cho cổng tương ứng.

---

## 8. Mở rộng gợi ý

- Thêm xác thực đăng nhập (Flask-Login) nếu nhiều người dùng truy cập dashboard.
- Thêm cache (Flask-Caching) cho các API `/api/charts/*` nếu dữ liệu lớn.
- Thêm import tự động định kỳ (cron job gọi `import_data.py`) nếu file Excel
  được cập nhật thường xuyên từ Google Sheets/Form.
- Thêm biểu đồ theo PIC (người phụ trách) để theo dõi hiệu suất từng bạn CTV.
