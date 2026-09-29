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
  // Thay thế dữ liệu từ API bằng dữ liệu tĩnh (hardcode) theo thiết kế mới
  const items = [
    { label: "Tổng số đăng ký", value: "119" },
    { label: "Đã thanh toán", value: "66" },
    { label: "Tỉ lệ chuyển đổi", value: "55,5%" },
    { label: "Doanh thu thực tế", value: "18.100.000 đ" },
    { label: "Hoa hồng đối tác", value: "362.000 đ" },
    { label: "Doanh thu công ty giữ lại", value: "17.738.000 đ" },
    { label: "Số người chưa thanh toán", value: "53" },
    { label: "Ngày lập báo cáo", value: "28/09/2026" }
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
new Chart(document.getElementById("chartRegion"), {
    type: "bar",
    data: {
      // Chia các khoảng điểm tương ứng với trục X
      labels: ["0-100", "100-200", "200-300", "300-400", "400-500", "500-600", "600-700", "700-800", "800-900", "900-1000", "1000-1100"],
      datasets: [{
        label: "Số thí sinh",
        // Dữ liệu số lượng thí sinh lấy từ các nhãn trên cột
        data: [0, 1, 8, 12, 29, 34, 19, 12, 4, 0, 0],
        backgroundColor: "#3174b4", // Màu xanh dương
        borderColor: "#ffffff",
        borderWidth: 1.5,
        // Ép các cột dính sát vào nhau để tạo hình dáng Histogram
        barPercentage: 1.0,
        categoryPercentage: 1.0
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false } // Ẩn chú thích vì chỉ có 1 dải dữ liệu
      },
      scales: {
        y: {
          title: { display: true, text: 'Số thí sinh', font: { weight: 'bold' } },
          max: 35, // Giới hạn trục Y theo hình
          grid: {
            borderDash: [5, 5] // Kẻ lưới ngang nét đứt
          }
        },
        x: {
          title: { display: true, text: 'Khoảng điểm', font: { weight: 'bold' } },
          grid: { display: false },
          ticks: {
            maxRotation: 45,
            minRotation: 0
          }
        }
      }
    }
  });

new Chart(document.getElementById("chartPayment"), {
    type: "bar",
    data: {
      labels: [
        "Mai Minh Sơn", "Lâm Thị Lan", "Phạm Hoài Giang", 
        "Đinh Minh Phúc", "Đinh Xuân Mai", "Vũ Tuấn Cường", 
        "Vũ Ngọc Duy", "Lâm Hoài Mai", "Nguyễn Đức Thành", 
        "Phạm Thu Khôi", "Lê Phương Tuệ", "Trần Thị Khôi", "Hồ Tuấn Hạnh"
      ],
      datasets: [{
        label: "Điểm số",
        data: [720, 770, 780, 860, 880, 890, 910, 930, 960, 970, 980, 990, 990],
        backgroundColor: [
          "#3174b4", "#3174b4", "#3174b4", // 3 thí sinh Bảng A màu xanh
          "#ed7d31", "#ed7d31", "#ed7d31", "#ed7d31", "#ed7d31", // 10 thí sinh Bảng B màu cam
          "#ed7d31", "#ed7d31", "#ed7d31", "#ed7d31", "#ed7d31"
        ],
        barThickness: 20 // Chỉnh độ dày của thanh ngang cho giống hình
      }]
    },
    options: {
      indexAxis: 'y', // Đảo trục để thành biểu đồ ngang
      responsive: true,
      plugins: {
        legend: { display: false } // Ẩn legend mặc định
      },
      scales: {
        x: {
          title: { display: true, text: 'Tổng điểm (/1000)', font: { weight: 'bold' } },
          max: 1100, // Đặt giới hạn trục X để có khoảng trống bên phải giống hình
          grid: {
            borderDash: [5, 5] // Đường kẻ dọc nét đứt
          }
        },
        y: {
          grid: { display: false } // Ẩn đường kẻ ngang
        }
      }
    }
  });

new Chart(document.getElementById("chartSchool"), {
    type: "bar",
    data: {
      labels: ["Bảng A", "Bảng B", "Toàn bộ"],
      datasets: [
        {
          label: "Vòng loại",
          data: [472.5, 541.4, 527.5],
          backgroundColor: "#3174b4", // Màu xanh dương theo ảnh
          borderColor: "#ffffff",
          borderWidth: 2
        },
        {
          label: "Chung kết",
          data: [756.7, 936.0, 894.6],
          backgroundColor: "#ec7d32", // Màu cam theo ảnh
          borderColor: "#ffffff",
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
          align: 'end' // Căn chú thích sang góc trên bên phải
        }
      },
      scales: {
        y: {
          title: { 
            display: true, 
            text: 'Điểm trung bình',
            font: { weight: 'bold' }
          },
          max: 1100, // Đặt giới hạn trục Y cho giống tỷ lệ hình ảnh
          grid: {
            borderDash: [5, 5] // Tạo đường kẻ ngang nét đứt
          }
        },
        x: {
          ticks: {
            font: { weight: 'bold' }
          },
          grid: {
            display: false // Ẩn đường kẻ dọc
          }
        }
      }
    }
  });

new Chart(document.getElementById("chartSegment"), {
    type: "bar",
    data: {
      labels: [
        "Tổng liên hệ",
        "Đăng ký website",
        "Tham gia vòng loại",
        "Vào chung kết",
        "Đạt chứng chỉ"
      ],
      datasets: [{
        label: "Số lượng",
        // Dữ liệu bám sát các con số trên hình ảnh
        data: [145, 119, 119, 13, 35], 
        backgroundColor: [
          "#393bc6", // Xanh đậm 
          "#5482e9", // Xanh dương
          "#5bc0de", // Xanh lơ
          "#52d397", // Xanh ngọc
          "#2ecc71"  // Xanh lá
        ],
        borderRadius: 4
      }]
    },
    options: {
      indexAxis: 'y', // Đảo trục thành biểu đồ ngang để tạo hiệu ứng phễu
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(context) {
              return "Số lượng: " + context.raw;
            }
          }
        }
      },
      scales: {
        x: {
          display: false // Ẩn trục X để giao diện tập trung vào các thanh ngang
        },
        y: {
          grid: { display: false }
        }
      }
    }
  });

new Chart(document.getElementById("chartSource"), {
    type: "line",
    data: {
      // Các mốc thời gian trên trục X theo hình ảnh
      labels: ["2026-08-07", "2026-08-14", "2026-08-22", "2026-08-26", "2026-08-27", "2026-08-29", "2026-09-21"],
      datasets: [
        {
          label: "Doanh thu thực",
          data: [0, 0, 0, 0, 500000, 500000, 650000], // Dữ liệu đường màu vàng
          borderColor: "#d4a373", 
          backgroundColor: "#d4a373",
          pointBackgroundColor: "#d4a373",
          pointRadius: 4,
          tension: 0 
        },
        {
          label: "Hoa hồng đối tác",
          data: [0, 0, 0, 0, 10000, 10000, 13000], // Dữ liệu đường màu xanh 
          borderColor: "#1d3557",
          backgroundColor: "#1d3557",
          pointBackgroundColor: "#1d3557",
          pointRadius: 4,
          tension: 0
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'right' 
        }
      },
      scales: {
        y: {
          title: { display: true, text: 'VNĐ' },
          min: 0,
          max: 700000,
          ticks: {
            stepSize: 100000, // Nhảy bậc 100.000 đ
            callback: function(value) {
               return value.toLocaleString("vi-VN") + " đ";
            }
          }
        },
        x: {
          title: { display: true, text: 'Ngày' },
          ticks: {
            maxRotation: 45, 
            minRotation: 45
          }
        }
      }
    }
  });

new Chart(document.getElementById("chartRevenue"), {
    type: "bar",
    data: {
      labels: ["Bảng A", "Bảng B"],
      datasets: [{
        label: "Doanh thu",
        data: [500000, 17600000],
        backgroundColor: "#d4a373" // Màu vàng theo hình ảnh
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(context) {
              // Format số hiển thị khi hover có dấu phẩy và chữ đ
              return context.raw.toLocaleString("vi-VN") + " đ";
            }
          }
        }
      },
      scales: {
        y: {
          title: { display: true, text: 'Doanh thu (đ)' },
          max: 20000000,
          ticks: {
            callback: function(value) {
               return value.toLocaleString("vi-VN");
            }
          }
        },
        x: {
          title: { display: true, text: 'Bảng' }
        }
      }
    }
  });

  new Chart(document.getElementById("chartTimeline"), {
    type: "bar",
    data: {
      labels: ["Tháng 7/2026", "Tháng 8/2026", "Tháng 9/2026"],
      datasets: [
        {
          label: "Tổng đăng ký",
          data: [8, 68, 13],
          backgroundColor: "#1d3557"
        },
        {
          label: "Đã thanh toán",
          data: [4, 26, 8],
          backgroundColor: "#d4a373"
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      },
      scales: {
        y: {
          title: {
            display: true,
            text: 'Số người'
          },
          max: 80
        }
      }
    }
  });

new Chart(document.getElementById("chartQuality"), {
    type: "line", // Chuyển sang dạng biểu đồ đường
    data: {
      labels: ["2026-08-27"], // Trục X chỉ có 1 ngày theo hình ảnh
      datasets: [
        {
          label: "Doanh thu thực",
          data: [0],
          borderColor: "#d4a373", // Màu vàng
          backgroundColor: "#d4a373",
          pointBackgroundColor: "#d4a373",
          pointRadius: 5
        },
        {
          label: "Hoa hồng đối tác",
          data: [0],
          borderColor: "#1d3557", // Màu xanh đậm
          backgroundColor: "#1d3557",
          pointBackgroundColor: "#1d3557",
          pointRadius: 5
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'right' // Đưa phần chú thích sang bên phải
        }
      },
      scales: {
        y: {
          title: { display: true, text: 'VNĐ' },
          min: 0,
          max: 500000,
          ticks: {
            stepSize: 50000, // Nhảy bậc 50.000 như trong hình
            callback: function(value) {
               return value.toLocaleString("vi-VN") + " đ";
            }
          }
        },
        x: {
          title: { display: true, text: 'Ngày' }
        }
      }
    }
  });

new Chart(document.getElementById("chartExamCity"), {
    type: "line",
    data: {
      // Các mốc thời gian trên trục X
      labels: ["2026-08-24", "2026-08-25", "2026-08-26", "2026-08-27", "2026-08-29", "2026-09-01", "2026-09-09"],
      datasets: [
        {
          label: "Doanh thu thực",
          data: [500000, 0, 0, 500000, 500000, 0, 650000], // Dữ liệu đường màu vàng
          borderColor: "#d4a373", 
          backgroundColor: "#d4a373",
          pointBackgroundColor: "#d4a373",
          pointRadius: 4,
          tension: 0 // Đặt 0 để đường vẽ gấp khúc thẳng giống như hình
        },
        {
          label: "Hoa hồng đối tác",
          data: [10000, 0, 0, 10000, 10000, 0, 13000], // Dữ liệu đường màu xanh (ước lượng dựa trên tỷ lệ hoa hồng)
          borderColor: "#1d3557",
          backgroundColor: "#1d3557",
          pointBackgroundColor: "#1d3557",
          pointRadius: 4,
          tension: 0
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'right' // Chú thích nằm bên phải
        }
      },
      scales: {
        y: {
          title: { display: true, text: 'VNĐ' },
          min: 0,
          max: 700000,
          ticks: {
            stepSize: 100000, // Nhảy bậc 100.000 đ
            callback: function(value) {
               return value.toLocaleString("vi-VN") + " đ";
            }
          }
        },
        x: {
          title: { display: true, text: 'Ngày' },
          ticks: {
            maxRotation: 45, // Tạo độ nghiêng cho ngày tháng để giống hình
            minRotation: 45
          }
        }
      }
    }
  });

  new Chart(document.getElementById("chartROI"), {
    type: "bar",
    data: {
      labels: ["Facebook", "Google", "TikTok", "Email", "Zalo", "Đối tác trường"],
      datasets: [{
        label: "ROI (%)",
        data: [22, -60, -100, 650, 50, 233], 
        backgroundColor: "#207a7e", 
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }, 
        tooltip: {
          callbacks: {
            label: function(context) { return "ROI: " + context.raw + "%"; }
          }
        }
      },
      scales: {
        y: {
          min: -200, 
          max: 700,  
          ticks: {
            stepSize: 100, 
            callback: function(value) { return value + "%"; }
          }
        },
        x: { grid: { display: false } }
      }
    }
  });

  new Chart(document.getElementById("chartBudgetRevenue"), {
    type: "bar",
    data: {
      labels: ["Facebook", "Google", "TikTok", "Email", "Zalo", "Đối tác trường"],
      datasets: [
        {
          label: "Ngân sách chi tiêu (VNĐ)",
          data: [3000000, 2500000, 1500000, 200000, 1000000, 300000],
          backgroundColor: "#1d3557" // Xanh đậm
        },
        {
          label: "Doanh thu thu về (VNĐ)",
          data: [3660000, 1000000, 0, 1500000, 1500000, 1000000],
          backgroundColor: "#d4a373" // Vàng gold
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.dataset.label + ": " + context.raw.toLocaleString("vi-VN") + " đ";
            }
          }
        }
      },
      scales: {
        y: {
          min: 0,
          max: 4000000,
          ticks: {
            stepSize: 500000,
            callback: function(value) {
              return value.toLocaleString("vi-VN") + " đ";
            }
          }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  });

    new Chart(document.getElementById("chartSponsorBenefit"), {
    type: "bar",
    data: {
      labels: [
        "Mention trong Email gửi thí sinh",
        "Video TVC phát tại Chung kết",
        "Logo trên Standee/Banner Offline",
        "Bài đăng tuyển dụng trên Fanpage",
        "Logo trên Website chính thức"
      ],
      datasets: [{
        label: "Tỷ lệ hoàn thành",
        data: [100, 100, 0, 50, 100],
        backgroundColor: "#0b2265", // Xanh navy đậm theo ảnh
        barThickness: 18
      }]
    },
    options: {
      indexAxis: 'y', // Đổi trục thành thanh ngang
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(context) {
              return "Hoàn thành: " + context.raw + "%";
            }
          }
        }
      },
      scales: {
        x: {
          min: 0,
          max: 100,
          ticks: {
            stepSize: 10,
            callback: function(value) {
              return value + "%";
            }
          },
          grid: {
            borderDash: [2, 2] // Lưới dọc đứt nét
          }
        },
        y: {
          grid: { display: false }
        }
      }
    }
  });
  
  new Chart(document.getElementById("chartEngagementRate"), {
    type: "bar",
    data: {
      labels: [
        "Email/thông báo trực tiếp",
        "Banner/standee tại 3 điểm cầu offline",
        "Livestream Chung kết",
        "Website chương trình (pythonmaster.vn)",
        "Fanpage & mạng xã hội chính thức"
      ],
      datasets: [{
        label: "Tỷ lệ tương tác",
        data: [20.0, 10.0, 15.0, 6.8, 5.8],
        backgroundColor: "#247d8b", // Màu xanh teal như ảnh
        barThickness: 18
      }]
    },
    options: {
      indexAxis: 'y', // Biểu đồ ngang
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(context) {
              return "Tỷ lệ: " + context.raw + "%";
            }
          }
        }
      },
      scales: {
        x: {
          min: 0,
          max: 25,
          ticks: {
            stepSize: 5,
            callback: function(value) {
              return value + "%";
            }
          },
          grid: {
            borderDash: [2, 2] // Kẻ lưới dọc đứt nét
          }
        },
        y: {
          grid: { display: false }
        }
      }
    }
  });

    new Chart(document.getElementById("chartProvinceDistribution"), {
    type: "bar",
    data: {
      labels: [
        "TP. Hồ Chí Minh",
        "Hà Nội",
        "Bắc Ninh",
        "Hà Tĩnh",
        "Hải Phòng",
        "Lâm Đồng",
        "Ninh Bình",
        "Phú Thọ",
        "Đồng Tháp"
      ],
      datasets: [{
        label: "Số thí sinh",
        data: [67, 44, 2, 1, 1, 1, 1, 1, 1],
        backgroundColor: [
          "#1e717d", // TP. HCM
          "#1a3556", // Hà Nội
          "#cba031", // Bắc Ninh
          "#84a9a7", // Hà Tĩnh
          "#a66459", // Hải Phòng
          "#527295", // Lâm Đồng
          "#ba875c", // Ninh Bình
          "#638a70", // Phú Thọ
          "#9f6f96"  // Đồng Tháp
        ],
        barThickness: 28
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(context) {
              return "Số thí sinh: " + context.raw;
            }
          }
        }
      },
      scales: {
        y: {
          title: {
            display: true,
            text: 'Số thí sinh',
            font: { weight: 'bold' }
          },
          min: 0,
          max: 80,
          ticks: {
            stepSize: 10
          }
        },
        x: {
          title: {
            display: true,
            text: 'Tỉnh/Thành',
            font: { weight: 'bold' }
          },
          grid: { display: false }
        }
      }
    }
  });

    new Chart(document.getElementById("chartRegionPayment"), {
    type: "bar",
    data: {
      labels: [
        "Miền Bắc", 
        ["Miền Trung &", "Tây Nguyên"], 
        "Miền Nam"
      ],
      datasets: [
        {
          label: "Đăng ký",
          data: [49, 2, 68],
          backgroundColor: "#1a3556" // Xanh navy đậm
        },
        {
          label: "Đã thanh toán",
          data: [14, 1, 50],
          backgroundColor: "#c9932b" // Vàng đất / vàng đồng
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 15,
            usePointStyle: false
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.dataset.label + ": " + context.raw + " người";
            }
          }
        }
      },
      scales: {
        y: {
          title: {
            display: true,
            text: 'Số người',
            font: { weight: 'bold' }
          },
          min: 0,
          max: 80,
          ticks: {
            stepSize: 10
          }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  });

    new Chart(document.getElementById("chartAgeByRegion"), {
    type: "bar",
    data: {
      labels: ["18 tuổi trở xuống", "19–20 tuổi", "21 tuổi trở lên"],
      datasets: [
        {
          label: "TP. Hồ Chí Minh",
          data: [37, 24, 6],
          backgroundColor: "#1a3556" // Xanh navy đậm
        },
        {
          label: "Hà Nội",
          data: [6, 25, 13],
          backgroundColor: "#cf9d2f" // Vàng đất / vàng đồng
        },
        {
          label: "Tỉnh khác",
          data: [3, 4, 1],
          backgroundColor: "#1e717d" // Xanh teal
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 15,
            usePointStyle: false
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.dataset.label + ": " + context.raw + " thí sinh";
            }
          }
        }
      },
      scales: {
        x: {
          stacked: true, // Cột chồng trục X
          grid: { display: false }
        },
        y: {
          stacked: true, // Cột chồng trục Y
          title: {
            display: true,
            text: 'Số thí sinh',
            font: { weight: 'bold' }
          },
          min: 0,
          max: 60,
          ticks: {
            stepSize: 10
          }
        }
      }
    }
  });

    new Chart(document.getElementById("chartTierCount"), {
    type: "bar",
    data: {
      labels: ["S", "A", "B", "C", "D"],
      datasets: [{
        label: "Số SV",
        data: [4, 12, 15, 49, 15],
        backgroundColor: [
          "#2b5c8f", // Tier S (xanh đậm)
          "#4172a6", // Tier A
          "#4f84be", // Tier B
          "#8ea4c8", // Tier C
          "#b4c4dc"  // Tier D (xanh nhạt)
        ],
        borderWidth: 1,
        borderColor: "#ffffff"
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(context) {
              return "Số SV: " + context.raw;
            }
          }
        }
      },
      scales: {
        y: {
          title: {
            display: true,
            text: 'Số SV',
            font: { weight: 'bold' }
          },
          min: 0,
          max: 60,
          ticks: {
            stepSize: 10
          }
        },
        x: {
          title: {
            display: true,
            text: 'Tier',
            font: { weight: 'bold' }
          },
          grid: { display: false }
        }
      }
    }
  });

    new Chart(document.getElementById("chartTopDebugging"), {
    type: "bar",
    data: {
      labels: [
        "Hồ Tuấn Hạnh",
        "Vũ Anh Duy",
        "Đinh Đức Nam",
        "Phạm Trung Chi",
        "Lê Phương Tuệ",
        "Lê Xuân Trí",
        "Lâm Hoài Mai",
        "Đinh Xuân Mai",
        "Nguyễn Đức Thành",
        "Trần Thị Khôi"
      ],
      datasets: [{
        label: "Điểm Debugging",
        data: [200, 210, 210, 210, 210, 220, 230, 230, 230, 240],
        backgroundColor: [
          "#dbe6d1", // Nhạt nhất
          "#cde0be",
          "#c0d8ac",
          "#b2d19b",
          "#9fc26b",
          "#8fb550",
          "#84a946",
          "#7e9f40",
          "#6d8c36",
          "#597629"  // Đậm nhất (Trần Thị Khôi)
        ],
        borderWidth: 1,
        borderColor: "#ffffff",
        barThickness: 20
      }]
    },
    options: {
      indexAxis: 'y', // Biểu đồ thanh ngang
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(context) {
              return "Điểm Debugging: " + context.raw + "/280";
            }
          }
        }
      },
      scales: {
        x: {
          min: 180,
          max: 250,
          ticks: {
            stepSize: 10
          },
          grid: {
            borderDash: [2, 2] // Đường gióng dọc nét đứt
          }
        },
        y: {
          grid: { display: false }
        }
      }
    }
  });

    new Chart(document.getElementById("chartTopDesign"), {
    type: "bar",
    data: {
      labels: [
        "Đinh Xuân Mai",
        "Lê Phương Tuệ",
        "Đinh Minh Phúc",
        "Đinh Đức Nam",
        "Vũ Ngọc Duy",
        "Trần Thị Khôi",
        "Nguyễn Đức Thành",
        "Phạm Thu Khôi",
        "Ngô Ngọc Toàn",
        "Hồ Tuấn Hạnh"
      ],
      datasets: [{
        label: "Điểm Design",
        data: [180, 190, 190, 200, 200, 200, 200, 210, 220, 230],
        backgroundColor: [
          "#ebccd1", // Nhạt nhất
          "#e2b4b9",
          "#d79aa1",
          "#cb818a",
          "#bf656f",
          "#b54e58",
          "#a73c47",
          "#99333e",
          "#892b35",
          "#78232c"  // Đậm nhất (Hồ Tuấn Hạnh)
        ],
        borderWidth: 1,
        borderColor: "#ffffff",
        barThickness: 20
      }]
    },
    options: {
      indexAxis: 'y', // Biểu đồ thanh ngang
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(context) {
              return "Điểm Design: " + context.raw + "/280";
            }
          }
        }
      },
      scales: {
        x: {
          min: 0,
          max: 250,
          ticks: {
            stepSize: 50
          },
          grid: {
            borderDash: [2, 2] // Gióng dọc đứt nét
          }
        },
        y: {
          grid: { display: false }
        }
      }
    }
  });

    new Chart(document.getElementById("chartSchoolAvgScore"), {
    type: "bar",
    data: {
      labels: [
        "Đại học Sư phạm Kỹ thuật TP.HCM",
        "Đại học FPT",
        "Đại học Khoa học Tự nhiên TP.HCM",
        "Đại học Kinh tế Quốc dân",
        "Đại học Duy Tân",
        "Đại học Bách Khoa TP.HCM",
        "Đại học CNTT - ĐHQG TP.HCM",
        "Đại học Bách Khoa Hà Nội",
        "Đại học Công nghệ - ĐHQGHN",
        "Học viện Công nghệ Bưu chính Viễn thông (PTIT)"
      ],
      datasets: [{
        label: "Điểm TB",
        data: [497, 515, 516, 516.7, 528.9, 530, 555, 572.2, 587.8, 605.6],
        backgroundColor: [
          "#d7dff0", // Nhạt nhất
          "#bccae3",
          "#a5b7d6",
          "#8da5cb",
          "#658bbb",
          "#517cb1",
          "#4670a4",
          "#3c6495",
          "#335783",
          "#26446c"  // Đậm nhất (PTIT)
        ],
        borderWidth: 1,
        borderColor: "#ffffff",
        barThickness: 18
      }]
    },
    options: {
      indexAxis: 'y', // Biểu đồ thanh ngang
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(context) {
              return "Điểm TB: " + context.raw + " / 1000";
            }
          }
        }
      },
      scales: {
        x: {
          min: 0,
          max: 700,
          ticks: {
            stepSize: 100
          },
          grid: {
            borderDash: [2, 2] // Kẻ lưới gióng dọc nét đứt
          }
        },
        y: {
          grid: { display: false }
        }
      }
    }
  });

    new Chart(document.getElementById("chartStudentVsAvg"), {
    type: "bar",
    data: {
      labels: ["Đọc hiểu", "Design", "Debugging"],
      datasets: [
        {
          label: "SV (%)",
          data: [95.5, 71.4, 82.1],
          backgroundColor: "#4172a6" // Xanh dương
        },
        {
          label: "TB QG (%)",
          data: [60, 45.8, 53.3],
          backgroundColor: "#8ea4c8" // Xanh lam nhạt
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 15,
            usePointStyle: false
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.dataset.label + ": " + context.raw + "%";
            }
          }
        }
      },
      scales: {
        y: {
          title: {
            display: true,
            text: '% điểm tối đa',
            font: { weight: 'bold' }
          },
          min: 0,
          max: 120,
          ticks: {
            stepSize: 20,
            callback: function(value) {
              return value + "%";
            }
          }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  });

  

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
