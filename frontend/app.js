const API = ""; // cung origin voi backend Flask (vd http://localhost:5000)

const palette = ["#2f5597", "#4472c4", "#70ad47", "#ffc000", "#ed7d31",
                  "#a5a5a5", "#264478", "#9e480e", "#636363", "#997300"];

async function fetchJSON(url) {
  const res = await fetch(API + url);
  if (!res.ok) throw new Error("Loi API: " + url);
  return res.json();
}

// ---------------------------------------------------------------------
// KPI cards
// ---------------------------------------------------------------------
async function loadKPI() {
  const data = await fetchJSON("/api/summary");
  const items = [
    { label: "Tổng số liên hệ", value: data.total_contacts },
    { label: "Đã thanh toán", value: data.paid_contacts },
    { label: "Chưa thanh toán", value: data.unpaid_contacts },
    { label: "Tổng doanh thu (VND)", value: data.total_revenue.toLocaleString("vi-VN") },
    { label: "Cần kiểm tra lại", value: data.need_check_count },
    { label: "Đăng ký qua website", value: data.web_registered_count },
  ];
  const grid = document.getElementById("kpiGrid");
  grid.innerHTML = items.map(i => `
    <div class="kpi-card">
      <div class="value">${i.value}</div>
      <div class="label">${i.label}</div>
    </div>
  `).join("");
}

// ---------------------------------------------------------------------
// Generic chart helpers
// ---------------------------------------------------------------------
function drawBar(ctxId, labels, values, title) {
  new Chart(document.getElementById(ctxId), {
    type: "bar",
    data: {
      labels,
      datasets: [{ label: title, data: values, backgroundColor: palette }]
    },
    options: { plugins: { legend: { display: false } }, responsive: true }
  });
}

function drawPie(ctxId, labels, values) {
  new Chart(document.getElementById(ctxId), {
    type: "pie",
    data: {
      labels,
      datasets: [{ data: values, backgroundColor: palette }]
    },
    options: { responsive: true }
  });
}

function drawLine(ctxId, labels, values, title) {
  new Chart(document.getElementById(ctxId), {
    type: "line",
    data: {
      labels,
      datasets: [{ label: title, data: values, borderColor: "#2f5597", fill: true,
                   backgroundColor: "rgba(47,85,151,0.15)", tension: 0.25 }]
    },
    options: { responsive: true }
  });
}

// ---------------------------------------------------------------------
// Load all charts
// ---------------------------------------------------------------------
async function loadCharts() {
  const region = await fetchJSON("/api/charts/region");
  drawPie("chartRegion", region.map(r => r.label), region.map(r => r.count));

  const payment = await fetchJSON("/api/charts/payment-status");
  drawPie("chartPayment", payment.map(r => r.label), payment.map(r => r.count));

  const school = await fetchJSON("/api/charts/school");
  drawBar("chartSchool", school.map(r => r.label), school.map(r => r.count), "Số lượng");

  const segment = await fetchJSON("/api/charts/segment");
  drawBar("chartSegment", segment.map(r => r.label), segment.map(r => r.count), "Số lượng");

  const source = await fetchJSON("/api/charts/source");
  drawBar("chartSource", source.map(r => r.label), source.map(r => r.count), "Số lượng");

  const revenue = await fetchJSON("/api/charts/revenue-by-region");
  drawBar("chartRevenue", revenue.map(r => r.label), revenue.map(r => r.revenue), "Doanh thu (VND)");

  const timeline = await fetchJSON("/api/charts/timeline");
  drawLine("chartTimeline", timeline.map(r => r.date), timeline.map(r => r.count), "Số đăng ký / ngày");

  const quality = await fetchJSON("/api/charts/data-quality");
  drawBar("chartQuality", quality.map(r => r.label), quality.map(r => r.count), "Số lỗi");

  const examCity = await fetchJSON("/api/charts/exam-by-city");
  drawPie("chartExamCity", examCity.map(r => r.label), examCity.map(r => r.count));

  // dien filter dropdown khu vuc tu chinh du lieu region
  const regionSelect = document.getElementById("regionFilter");
  region.forEach(r => {
    const opt = document.createElement("option");
    opt.value = r.label; opt.textContent = r.label;
    regionSelect.appendChild(opt);
  });
  const paymentSelect = document.getElementById("paymentFilter");
  payment.forEach(r => {
    const opt = document.createElement("option");
    opt.value = r.label; opt.textContent = r.label;
    paymentSelect.appendChild(opt);
  });
}

// ---------------------------------------------------------------------
// Drip segments table
// ---------------------------------------------------------------------
async function loadDripTable() {
  const rows = await fetchJSON("/api/drip-segments");
  const tbody = document.querySelector("#dripTable tbody");
  tbody.innerHTML = rows.map(r => `
    <tr>
      <td>${r.drip ?? ""}</td>
      <td>${r.segment ?? ""}</td>
      <td>${r.entry_condition ?? ""}</td>
      <td>${r.goal ?? ""}</td>
      <td>${r.contact_count ?? ""}</td>
      <td>${r.sendable_count ?? ""}</td>
    </tr>
  `).join("");
}

// ---------------------------------------------------------------------
// Contacts table with filter + pagination
// ---------------------------------------------------------------------
let currentPage = 1;

async function loadContacts(page = 1) {
  currentPage = page;
  const search = document.getElementById("searchInput").value;
  const region = document.getElementById("regionFilter").value;
  const payment = document.getElementById("paymentFilter").value;

  const params = new URLSearchParams({ page, page_size: 20 });
  if (search) params.set("search", search);
  if (region) params.set("region", region);
  if (payment) params.set("payment_status", payment);

  const data = await fetchJSON("/api/contacts?" + params.toString());
  const tbody = document.querySelector("#contactsTable tbody");
  tbody.innerHTML = data.items.map(c => `
    <tr>
      <td>${c.contact_id ?? ""}</td>
      <td>${c.full_name ?? ""}</td>
      <td>${c.email ?? ""}</td>
      <td>${c.phone ?? ""}</td>
      <td>${c.region ?? ""}</td>
      <td>${c.school ?? ""}</td>
      <td>${c.payment_status ?? ""}</td>
      <td>${c.segment_name ?? ""}</td>
    </tr>
  `).join("");

  renderPagination(data.total, data.page, data.page_size);
}

function renderPagination(total, page, pageSize) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const container = document.getElementById("pagination");
  let html = "";
  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="${i === page ? "active" : ""}" onclick="loadContacts(${i})">${i}</button>`;
  }
  container.innerHTML = html;
}

// ---------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------
async function checkHealth() {
  const el = document.getElementById("dbStatus");
  try {
    const data = await fetchJSON("/api/health");
    el.textContent = data.ok ? "🟢 Đã kết nối MongoDB" : "🔴 " + data.message;
  } catch (e) {
    el.textContent = "🔴 Không thể kết nối backend";
  }
}

// ---------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------
(async function init() {
  await checkHealth();
  await loadKPI();
  await loadCharts();
  await loadDripTable();
  await loadContacts(1);
})();
