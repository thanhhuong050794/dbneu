const API = "";

async function fetchJSON(url) {
  const res = await fetch(API + url);
  if (!res.ok) throw new Error("Loi API: " + url);
  return res.json();
}

async function checkHealth() {
  const el = document.getElementById("dbStatus");
  if (!el) return;
  try {
    const data = await fetchJSON("/api/health");
    el.textContent = data.ok ? "🟢 Đã kết nối MongoDB" : "🔴 " + data.message;
  } catch (e) {
    el.textContent = "🔴 Không thể kết nối backend";
  }
}

function loadDaiHocCharts() {
  // 1. Top 10 sinh viên toàn quốc theo tổng điểm
  const canvasTop10 = document.getElementById("chartTop10TotalScore");
  if (canvasTop10) {
    new Chart(canvasTop10, {
      type: "bar",
      data: {
        labels: [
          "Lâm Hoài Mai",
          "Phạm Thu Khôi",
          "Lê Phương Tuệ",
          "Đinh Minh Phúc",
          "Vũ Ngọc Duy",
          "Đinh Xuân Mai",
          "Trần Thị Khôi",
          "Hồ Tuấn Hạnh",
          "Nguyễn Đức Thành",
          "Ho ten"
        ],
        datasets: [{
          label: "Tổng điểm",
          data: [760, 770, 770, 770, 770, 790, 810, 830, 850, 850],
          backgroundColor: [
            "#d5dde9",
            "#b8c7db",
            "#9cb2ce",
            "#809dc0",
            "#6488b3",
            "#4f79ab",
            "#436b9e",
            "#395c8c",
            "#30507d",
            "#27426a"
          ],
          borderWidth: 1,
          borderColor: "#ffffff",
          barThickness: 20
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context) { return "Tổng điểm: " + context.raw; }
            }
          }
        },
        scales: {
          x: {
            min: 700,
            max: 860,
            ticks: { stepSize: 20 },
            grid: { borderDash: [2, 2] }
          },
          y: { grid: { display: false } }
        }
      }
    });
  }

  // 2. Điểm TB các trường ĐH so với TB toàn quốc (thang 1.000)
  const canvasSchool = document.getElementById("chartSchoolAvgScore");
  if (canvasSchool) {
    new Chart(canvasSchool, {
      type: "bar",
      data: {
        labels: [
          "Đại học FPT",
          "Đại học Khoa học Tự nhiên TP.HCM",
          "Đại học Kinh tế Quốc dân",
          "Đại học Duy Tân",
          "Đại học Bách Khoa TP.HCM",
          "Đại học CNTT - ĐHQG TP.HCM",
          "Đại học Bách Khoa Hà Nội",
          "Đại học Công nghệ - ĐHQGHN",
          "Học viện Công nghệ Bưu chính Viễn thông (PTIT)",
          "Truong DH"
        ],
        datasets: [{
          label: "Điểm TB",
          data: [497, 515, 516, 516.7, 528.9, 530, 555, 572.2, 587.8, 605.6],
          backgroundColor: [
            "#d7dff0",
            "#bccae3",
            "#a5b7d6",
            "#8da5cb",
            "#658bbb",
            "#517cb1",
            "#4670a4",
            "#3c6495",
            "#335783",
            "#26446c"
          ],
          borderWidth: 1,
          borderColor: "#ffffff",
          barThickness: 18
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context) { return "Điểm TB: " + context.raw + " / 1000"; }
            }
          }
        },
        scales: {
          x: {
            min: 0,
            max: 700,
            ticks: { stepSize: 100 },
            grid: { borderDash: [2, 2] }
          },
          y: { grid: { display: false } }
        }
      }
    });
  }

  // 3. Tỉ lệ SV đạt chứng chỉ COS Pro theo trường (%)
  const canvasCert = document.getElementById("chartCertRateBySchool");
  if (canvasCert) {
    new Chart(canvasCert, {
      type: "bar",
      data: {
        labels: [
          "Đại học FPT",
          "Đại học Khoa học Tự nhiên TP.HCM",
          "Đại học Kinh tế Quốc dân",
          "Đại học Duy Tân",
          "Đại học Bách Khoa TP.HCM",
          "Đại học CNTT - ĐHQG TP.HCM",
          "Đại học Bách Khoa Hà Nội",
          "Đại học Công nghệ - ĐHQGHN",
          "Học viện Công nghệ Bưu chính Viễn thông (PTIT)",
          "Truong DH"
        ],
        datasets: [{
          label: "Tỉ lệ đạt chứng chỉ COS Pro",
          data: [30, 20, 30, 11.1, 22.2, 20, 50, 33.3, 55.6, 55.6],
          backgroundColor: [
            "#e3eed4",
            "#d1e2bb",
            "#c0d6a2",
            "#afca89",
            "#9ebe70",
            "#8eb257",
            "#7da743",
            "#6e9438",
            "#5f822f",
            "#4f6f25"
          ],
          borderWidth: 1,
          borderColor: "#ffffff",
          barThickness: 18
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context) { return "Tỉ lệ: " + context.raw + "%"; }
            }
          }
        },
        scales: {
          x: {
            min: 0,
            max: 60,
            ticks: {
              stepSize: 10,
              callback: function(value) { return value + "%"; }
            },
            grid: { borderDash: [2, 2] }
          },
          y: { grid: { display: false } }
        }
      }
    });
  }

  // 4. Số SV tham gia theo từng trường ĐH
  const canvasCount = document.getElementById("chartStudentCountBySchool");
  if (canvasCount) {
    new Chart(canvasCount, {
      type: "bar",
      data: {
        labels: [
          "Đại học FPT",
          "Đại học Khoa học Tự nhiên TP.HCM",
          "Đại học Kinh tế Quốc dân",
          "Đại học Duy Tân",
          "Đại học Bách Khoa TP.HCM",
          "Đại học CNTT - ĐHQG TP.HCM",
          "Đại học Bách Khoa Hà Nội",
          "Đại học Công nghệ - ĐHQGHN",
          "Học viện Công nghệ Bưu chính Viễn thông (PTIT)",
          "Truong DH"
        ],
        datasets: [{
          label: "Số SV tham gia",
          data: [10, 10, 10, 9, 9, 10, 10, 9, 9, 9],
          backgroundColor: [
            "#ebccd1",
            "#dfadb5",
            "#d38e9a",
            "#c7707e",
            "#ba5464",
            "#ad394a",
            "#9f2638",
            "#8c2030",
            "#7a1a27",
            "#661520"
          ],
          borderWidth: 1,
          borderColor: "#ffffff",
          barThickness: 18
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context) { return "Số SV: " + context.raw; }
            }
          }
        },
        scales: {
          x: {
            min: 8.4,
            max: 10.2,
            ticks: { stepSize: 0.2 },
            grid: { borderDash: [2, 2] }
          },
          y: { grid: { display: false } }
        }
      }
    });
  }

  // 5. Điểm cao nhất của từng trường ĐH
  const canvasMax = document.getElementById("chartMaxScoreBySchool");
  if (canvasMax) {
    new Chart(canvasMax, {
      type: "bar",
      data: {
        labels: [
          "Đại học FPT",
          "Đại học Khoa học Tự nhiên TP.HCM",
          "Đại học Kinh tế Quốc dân",
          "Đại học Duy Tân",
          "Đại học Bách Khoa TP.HCM",
          "Đại học CNTT - ĐHQG TP.HCM",
          "Đại học Bách Khoa Hà Nội",
          "Đại học Công nghệ - ĐHQGHN",
          "Học viện Công nghệ Bưu chính Viễn thông (PTIT)",
          "Truong DH"
        ],
        datasets: [{
          label: "Điểm cao nhất",
          data: [850, 680, 760, 760, 850, 770, 730, 830, 810, 790],
          backgroundColor: [
            "#ded9e2",
            "#c7bed1",
            "#b1a3bf",
            "#9b89ad",
            "#866f9b",
            "#715589",
            "#64497a",
            "#583e6d",
            "#4c345f",
            "#402951"
          ],
          borderWidth: 1,
          borderColor: "#ffffff",
          barThickness: 18
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context) { return "Điểm cao nhất: " + context.raw; }
            }
          }
        },
        scales: {
          x: {
            min: 0,
            max: 900,
            ticks: { stepSize: 100 },
            grid: { borderDash: [2, 2] }
          },
          y: { grid: { display: false } }
        }
      }
    });
  }

  // 6. Số SV top theo nhóm (Top 10 - Top 25 - Top 50) theo từng trường
  const canvasRank = document.getElementById("chartTopRankBySchool");
  if (canvasRank) {
    new Chart(canvasRank, {
      type: "bar",
      data: {
        labels: [
          ["Học viện Công nghệ", "BCVT (PTIT)"],
          ["Đại học Công nghệ", "- ĐHQGHN"],
          ["Đại học Bách Khoa", "Hà Nội"],
          ["Đại học CNTT -", "ĐHQG TP.HCM"],
          ["Đại học Bách Khoa", "TP.HCM"],
          "Đại học Duy Tân",
          ["Đại học Kinh tế", "Quốc dân"],
          ["ĐH Khoa học Tự nhiên", "TP.HCM"],
          "Đại học FPT",
          ["ĐH Sư phạm Kỹ thuật", "TP.HCM"]
        ],
        datasets: [
          {
            label: "Top 10",
            data: [0, 0, 0, 1, 1, 0, 0, 1, 1, 1],
            backgroundColor: "#2f5597"
          },
          {
            label: "Top 25",
            data: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
            backgroundColor: "#4472c4"
          },
          {
            label: "Top 50",
            data: [4, 4, 4, 5, 5, 4, 4, 5, 5, 5],
            backgroundColor: "#a0b8d8"
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { boxWidth: 15, usePointStyle: false }
          },
          tooltip: {
            callbacks: {
              label: function(context) { return context.dataset.label + ": " + context.raw + " SV"; }
            }
          }
        },
        scales: {
          y: {
            title: { display: true, text: 'Số SV', font: { weight: 'bold' } },
            min: 0,
            max: 6,
            ticks: { stepSize: 1 }
          },
          x: {
            title: { display: true, text: 'Trường ĐH', font: { weight: 'bold' } },
            grid: { display: false }
          }
        }
      }
    });
  }

  // 7. Top 5 sinh viên tiêu biểu của PTIT (theo điểm vòng loại)
  const canvasPtit = document.getElementById("chartTopPtitStudents");
  if (canvasPtit) {
    new Chart(canvasPtit, {
      type: "bar",
      data: {
        labels: [
          "5. ĐẶNG TRUNG AN",
          "4. LÝ NGỌC YẾN",
          "3. LÂM HOÀI MAI",
          "2. ĐINH MINH PHÚC",
          "1. VŨ NGỌC DUY"
        ],
        datasets: [
          {
            label: "Tong diem",
            data: [660, 680, 770, 770, 790],
            backgroundColor: "#5b9bd5", // Xanh dương
            borderWidth: 1,
            borderColor: "#ffffff"
          },
          {
            label: "Doc",
            data: [340, 370, 380, 400, 390],
            backgroundColor: "#d06868", // Đỏ san hô
            borderWidth: 1,
            borderColor: "#ffffff"
          },
          {
            label: "Design",
            data: [130, 160, 160, 190, 200],
            backgroundColor: "#a9d18e", // Xanh lá mạ
            borderWidth: 1,
            borderColor: "#ffffff"
          },
          {
            label: "Debug",
            data: [190, 150, 230, 180, 200],
            backgroundColor: "#8e7cc3", // Tím lavender
            borderWidth: 1,
            borderColor: "#ffffff"
          }
        ]
      },
      options: {
        indexAxis: 'y', // Biểu đồ thanh ngang
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { boxWidth: 15, usePointStyle: false }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.dataset.label + ": " + context.raw + " điểm";
              }
            }
          }
        },
        scales: {
          x: {
            stacked: true, // Chồng các thành phần lên nhau
            grid: { borderDash: [2, 2] }
          },
          y: {
            stacked: true,
            grid: { display: false }
          }
        }
      }
    });
  }

  // 8. Top 5 sinh viên tiêu biểu của UET (theo điểm vòng loại)
  const canvasUet = document.getElementById("chartTopUetStudents");
  if (canvasUet) {
    new Chart(canvasUet, {
      type: "bar",
      data: {
        labels: [
          "5. ĐỖ HOÀI LONG",
          "4. PHẠM TUẤN PHONG",
          "3. VÕ PHƯƠNG NGUYÊN",
          "2. NGÔ VĂN QUYÊN",
          "1. ĐINH XUÂN MAI"
        ],
        datasets: [
          {
            label: "Tong diem",
            data: [620, 690, 700, 700, 810],
            backgroundColor: "#5b9bd5", // Xanh dương
            borderWidth: 1,
            borderColor: "#ffffff"
          },
          {
            label: "Doc",
            data: [330, 350, 380, 370, 400],
            backgroundColor: "#d06868", // Đỏ san hô
            borderWidth: 1,
            borderColor: "#ffffff"
          },
          {
            label: "Design",
            data: [110, 150, 160, 140, 180],
            backgroundColor: "#a9d18e", // Xanh lá mạ
            borderWidth: 1,
            borderColor: "#ffffff"
          },
          {
            label: "Debug",
            data: [180, 190, 160, 190, 230],
            backgroundColor: "#8e7cc3", // Tím lavender
            borderWidth: 1,
            borderColor: "#ffffff"
          }
        ]
      },
      options: {
        indexAxis: 'y', // Biểu đồ thanh ngang
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { boxWidth: 15, usePointStyle: false }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.dataset.label + ": " + context.raw + " điểm";
              }
            }
          }
        },
        scales: {
          x: {
            stacked: true,
            min: 0,
            max: 1800,
            ticks: { stepSize: 200 },
            grid: { borderDash: [2, 2] }
          },
          y: {
            stacked: true,
            grid: { display: false }
          }
        }
      }
    });
  }

  // 9. Top 5 sinh viên tiêu biểu của HUST (theo điểm vòng loại)
  const canvasHust = document.getElementById("chartTopHustStudents");
  if (canvasHust) {
    new Chart(canvasHust, {
      type: "bar",
      data: {
        labels: [
          "5. MAI NGỌC TOÀN",
          "4. BÙI XUÂN KHOA",
          "3. VŨ ĐỨC HÙNG",
          "2. LÊ XUÂN TRÍ",
          "1. TRẦN THỊ KHÔI"
        ],
        datasets: [
          {
            label: "Tong diem",
            data: [590, 590, 610, 650, 830],
            backgroundColor: "#5b9bd5", // Xanh dương
            borderWidth: 1,
            borderColor: "#ffffff"
          },
          {
            label: "Doc",
            data: [320, 260, 310, 270, 390],
            backgroundColor: "#d06868", // Đỏ san hô
            borderWidth: 1,
            borderColor: "#ffffff"
          },
          {
            label: "Design",
            data: [110, 130, 160, 160, 200],
            backgroundColor: "#a9d18e", // Xanh lá mạ
            borderWidth: 1,
            borderColor: "#ffffff"
          },
          {
            label: "Debug",
            data: [160, 200, 140, 220, 240],
            backgroundColor: "#8e7cc3", // Tím lavender
            borderWidth: 1,
            borderColor: "#ffffff"
          }
        ]
      },
      options: {
        indexAxis: 'y', // Biểu đồ thanh ngang
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { boxWidth: 15, usePointStyle: false }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.dataset.label + ": " + context.raw + " điểm";
              }
            }
          }
        },
        scales: {
          x: {
            stacked: true,
            min: 0,
            max: 1800,
            ticks: { stepSize: 200 },
            grid: { borderDash: [2, 2] }
          },
          y: {
            stacked: true,
            grid: { display: false }
          }
        }
      }
    });
  }

  // 10. Phân bổ sinh viên tiềm năng theo phân loại
  const canvasPie = document.getElementById("chartPotentialTierDistribution");
  if (canvasPie) {
    new Chart(canvasPie, {
      type: "pie",
      data: {
        labels: [
          "A - Ưu tiên cao",
          "A - Tiềm năng cao",
          "B - Tiềm năng",
          "C - Theo dõi",
          "D - Nuôi dưỡng"
        ],
        datasets: [{
          data: [4, 12, 15, 49, 15],
          backgroundColor: [
            "#4172a6", // Xanh dương (4, 4%)
            "#c0504d", // Đỏ gạch (12, 13%)
            "#9bbb59", // Xanh cốm (15, 16%)
            "#8064a2", // Tím (49, 51%)
            "#4bacc6"  // Xanh ngọc (15, 16%)
          ],
          borderWidth: 1,
          borderColor: "#ffffff"
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              boxWidth: 15,
              usePointStyle: false,
              padding: 12
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const total = 95;
                const val = context.raw;
                const pct = Math.round((val / total) * 100);
                return context.label + ": " + val + " SV (" + pct + "%)";
              }
            }
          }
        }
      }
    });
  }
}

// Khởi chạy ngay lập tức khi file script được đọc
(function init() {
  loadDaiHocCharts();
  checkHealth();
})();
