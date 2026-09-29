// =============================================
// thpt.js — Phân tích THPT
// =============================================

// --- Health check ---
async function checkHealth() {
  try {
    const res = await fetch('/api/health');
    const data = await res.json();
    document.getElementById('dbStatus').textContent =
      data.status === 'ok' ? '✅ Kết nối DB thành công' : '⚠ DB: ' + data.status;
  } catch {
    document.getElementById('dbStatus').textContent = '⚠ Không kết nối được backend';
  }
}

// --- THPT Charts ---
function loadThptCharts() {

  // 1. Điểm TB các trường THPT (thang 1.000)
  new Chart(document.getElementById('chartThptAvgScore'), {
    type: 'bar',
    data: {
      labels: ['THPT Kim Liên', 'THPT Việt Đức', 'THPT Lê Quý Đôn', 'THPT Nguyễn Huệ', 'THPT Chu Văn An'],
      datasets: [{
        label: 'Điểm TB',
        data: [397.5, 440, 496, 502, 512],
        backgroundColor: [
          'rgba(173,198,230,0.85)',
          'rgba(155,185,222,0.85)',
          'rgba(120,160,210,0.85)',
          'rgba(90,135,195,0.85)',
          'rgba(60,110,180,0.85)'
        ],
        borderColor: [
          'rgba(173,198,230,1)',
          'rgba(155,185,222,1)',
          'rgba(120,160,210,1)',
          'rgba(90,135,195,1)',
          'rgba(60,110,180,1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: {
        legend: { display: false },
        datalabels: { display: false }
      },
      scales: {
        x: {
          min: 0,
          max: 600,
          title: { display: true, text: 'Trường THPT' }
        },
        y: {
          title: { display: true, text: 'ĐIỂM TB' }
        }
      }
    }
  // 2. Tương quan Điểm TB và Tỉ lệ đạt chứng chỉ (scatter)
  new Chart(document.getElementById('chartThptScatterCert'), {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: '512',
          data: [{ x: 512, y: 0.5 }],
          backgroundColor: 'rgba(34,85,34,0.85)',
          pointRadius: 10
        },
        {
          label: '502',
          data: [{ x: 502, y: 20 }],
          backgroundColor: 'rgba(60,120,60,0.85)',
          pointRadius: 10
        },
        {
          label: '496',
          data: [{ x: 496, y: 40 }],
          backgroundColor: 'rgba(90,150,90,0.85)',
          pointRadius: 10
        },
        {
          label: '440',
          data: [{ x: 440, y: 40 }],
          backgroundColor: 'rgba(140,190,100,0.85)',
          pointRadius: 10
        },
        {
          label: '397.5',
          data: [{ x: 397.5, y: 0.5 }],
          backgroundColor: 'rgba(190,220,150,0.85)',
          pointRadius: 10
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'right' }
      },
      scales: {
        x: {
          min: 0,
          max: 600,
          title: { display: true, text: 'Điểm TB' }
        },
        y: {
          min: 0,
          max: 45,
          title: { display: true, text: 'Tỉ lệ đạt chứng chỉ COS Pro (%)' }
        }
      }
    }
  });
  // 3. Phân bố điểm Vòng loại (24 HS Bảng A)
  new Chart(document.getElementById('chartThptScoreDistribution'), {
    type: 'bar',
    data: {
      labels: ['0-100','100-200','200-300','300-400','400-500','500-600','600-700','700-800','800-900','900-1000'],
      datasets: [{
        label: 'Số học sinh',
        data: [0, 0, 4, 4, 7, 10, 4, 0, 0, 0],
        backgroundColor: [
          'rgba(180,180,180,0.7)',
          'rgba(180,180,180,0.7)',
          'rgba(120,180,80,0.85)',
          'rgba(130,80,180,0.85)',
          'rgba(50,180,180,0.85)',
          'rgba(230,120,30,0.85)',
          'rgba(150,170,220,0.85)',
          'rgba(180,180,180,0.7)',
          'rgba(180,180,180,0.7)',
          'rgba(180,180,180,0.7)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        datalabels: { display: false }
      },
      scales: {
        x: {
          title: { display: true, text: 'Khoảng điểm' }
        },
        y: {
          min: 0,
          max: 12,
          title: { display: true, text: 'Số học sinh' },
          ticks: { stepSize: 2 }
        }
      }
    }
  });
  // 4. Điểm tổng hợp xếp hạng học thuật (thang 100)
  new Chart(document.getElementById('chartThptAcademicRank'), {
    type: 'bar',
    data: {
      labels: ['THPT Việt Đức', 'THPT Nguyễn Huệ', 'THPT Kim Liên', 'THPT Chu Văn An', 'THPT Lê Quý Đôn'],
      datasets: [{
        label: 'Điểm tổng hợp',
        data: [33.8, 38.6, 43.1, 49.4, 58.2],
        backgroundColor: [
          'rgba(173,198,230,0.85)',
          'rgba(140,175,220,0.85)',
          'rgba(100,148,210,0.85)',
          'rgba(60,115,190,0.85)',
          'rgba(30,80,165,0.85)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: {
        legend: { display: false },
        datalabels: { display: false }
      },
      scales: {
        x: {
          min: 0,
          max: 70,
          title: { display: true, text: 'Trường THPT' }
        },
        y: {
          title: { display: true, text: 'Điểm tổng hợp' }
        }
      }
    }
  });
  // 5. So sánh % điểm tối đa theo từng kỹ năng
  new Chart(document.getElementById('chartThptSkillCompare'), {
    type: 'bar',
    data: {
      labels: ['THPT Kim Liên', 'THPT Việt Đức', 'THPT Lê Quý Đôn', 'THPT Nguyễn Huệ', 'THPT Chu Văn An'],
      datasets: [
        {
          label: 'Design (%)',
          data: [20, 38.4, 43.2, 44.8, 43.6],
          backgroundColor: 'rgba(173,198,230,0.85)',
          borderWidth: 1
        },
        {
          label: 'Doc (%)',
          data: [46.5, 49.6, 56, 55.6, 58.8],
          backgroundColor: 'rgba(50,100,180,0.85)',
          borderWidth: 1
        }
      ]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: {
        legend: { position: 'bottom' }
      },
      scales: {
        x: {
          min: 0,
          max: 70,
          title: { display: true, text: 'Trường THPT' }
        },
        y: {
          title: { display: true, text: '% điểm tối đa' }
        }
      }
    }
  });
  // 6. Top 10 HS Bảng A Toàn Quốc
  new Chart(document.getElementById('chartThptTop10National'), {
    type: 'bar',
    data: {
      labels: [
        'PHẠM HOÀI GIANG', 'LÂM THỊ LAN', 'MAI MINH SƠN', 'TRỊNH THỊ GIANG',
        'HOÀNG HỮU BÌNH', 'HỒ HỮU VY', 'PHẠM KHÁNH HOA', 'DƯƠNG HOÀI NAM',
        'LÂM HOÀI YẾN', 'BÙI KHÁNH VINH'
      ],
      datasets: [{
        label: 'Tổng điểm',
        data: [670, 640, 595, 585, 565, 520, 510, 500, 495, 510],
        backgroundColor: 'rgba(120,80,180,0.80)',
        borderColor: 'rgba(100,60,160,1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          ticks: { maxRotation: 45, minRotation: 45 }
        },
        y: {
          min: 0,
          max: 800,
          ticks: { stepSize: 100 }
        }
      }
    }
  });
  // 7. Top 5 HS THPT Chu Văn An (stacked: Tổng điểm, Đọc, Design)
  new Chart(document.getElementById('chartThptTop5ChuVanAn'), {
    type: 'bar',
    data: {
      labels: ['MAI HẢI HIẾU', 'ĐẶNG XUÂN GIANG', 'PHAN XUÂN PHONG', 'LÂM HOÀI YẾN', 'MAI MINH SƠN'],
      datasets: [
        {
          label: 'Tổng điểm',
          data: [450, 490, 490, 530, 600],
          backgroundColor: 'rgba(70,130,200,0.85)'
        },
        {
          label: 'Đọc',
          data: [250, 240, 270, 340, 370],
          backgroundColor: 'rgba(200,60,60,0.85)'
        },
        {
          label: 'Design',
          data: [200, 250, 220, 190, 230],
          backgroundColor: 'rgba(100,180,80,0.85)'
        }
      ]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: {
        legend: { position: 'bottom' }
      },
      scales: {
        x: {
          stacked: true,
          min: 0,
          max: 1400
        },
        y: {
          stacked: true
        }
      }
    }
  });
  // 8. Top 5 HS THPT Nguyễn Huệ (stacked: Tổng điểm, Đọc, Design)
  new Chart(document.getElementById('chartThptTop5NguyenHue'), {
    type: 'bar',
    data: {
      labels: ['ĐẶNG THU DŨNG', 'LÊ HẢI VY', 'DƯƠNG HOÀI NAM', 'PHẠM KHÁNH HOA', 'HOÀNG HỮU BÌNH'],
      datasets: [
        {
          label: 'Tổng điểm',
          data: [320, 500, 540, 560, 590],
          backgroundColor: 'rgba(70,130,200,0.85)'
        },
        {
          label: 'Đọc',
          data: [250, 290, 290, 280, 280],
          backgroundColor: 'rgba(200,60,60,0.85)'
        },
        {
          label: 'Design',
          data: [70, 210, 250, 280, 310],
          backgroundColor: 'rgba(100,180,80,0.85)'
        }
      ]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: {
        legend: { position: 'bottom' }
      },
      scales: {
        x: {
          stacked: true,
          min: 0,
          max: 1400
        },
        y: {
          stacked: true
        }
      }
    }
  });
  // 9. Top 5 HS THPT Lê Quý Đôn (stacked: Tổng điểm, Đọc, Design)
  new Chart(document.getElementById('chartThptTop5LeQuyDon'), {
    type: 'bar',
    data: {
      labels: ['PHAN ANH NGÂN', 'PHẠM THU PHONG', 'BÙI THỊ TRANG', 'TRỊNH THỊ GIANG', 'PHẠM HOÀI GIANG'],
      datasets: [
        {
          label: 'Tổng điểm',
          data: [300, 400, 510, 600, 670],
          backgroundColor: 'rgba(70,130,200,0.85)'
        },
        {
          label: 'Đọc',
          data: [170, 220, 310, 300, 400],
          backgroundColor: 'rgba(200,60,60,0.85)'
        },
        {
          label: 'Design',
          data: [130, 180, 200, 300, 270],
          backgroundColor: 'rgba(100,180,80,0.85)'
        }
      ]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: {
        legend: { position: 'bottom' }
      },
      scales: {
        x: {
          stacked: true,
          min: 0,
          max: 1600
        },
        y: {
          stacked: true
        }
      }
    }
  });
  // 10. Top 5 HS THPT Việt Đức (stacked: Tổng điểm, Đọc, Design)
  new Chart(document.getElementById('chartThptTop5VietDuc'), {
    type: 'bar',
    data: {
      labels: ['DƯƠNG HỮU NHI', 'TẠ THỊ TRANG', 'HOÀNG ANH YẾN', 'BÙI KHÁNH VINH', 'HỒ HỮU VY'],
      datasets: [
        {
          label: 'Tổng điểm',
          data: [280, 350, 480, 530, 560],
          backgroundColor: 'rgba(70,130,200,0.85)'
        },
        {
          label: 'Đọc',
          data: [150, 220, 270, 250, 350],
          backgroundColor: 'rgba(200,60,60,0.85)'
        },
        {
          label: 'Design',
          data: [130, 130, 210, 280, 210],
          backgroundColor: 'rgba(100,180,80,0.85)'
        }
      ]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: {
        legend: { position: 'bottom' }
      },
      scales: {
        x: {
          stacked: true,
          min: 0,
          max: 1200
        },
        y: {
          stacked: true
        }
      }
    }
  });

  // 11. Top 5 HS THPT Kim Liên (stacked: Tổng điểm, Đọc, Design)
  new Chart(document.getElementById('chartThptTop5KimLien'), {
    type: 'bar',
    data: {
      labels: ['VÕ PHƯƠNG PHÚC', 'MAI GIA HẢI', 'TRẦN THANH CƯỜNG', 'LÂM THỊ LAN'],
      datasets: [
        {
          label: 'Tổng điểm',
          data: [260, 270, 410, 650],
          backgroundColor: 'rgba(70,130,200,0.85)'
        },
        {
          label: 'Đọc',
          data: [130, 180, 190, 430],
          backgroundColor: 'rgba(200,60,60,0.85)'
        },
        {
          label: 'Design',
          data: [130, 90, 220, 220],
          backgroundColor: 'rgba(100,180,80,0.85)'
        }
      ]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: {
        legend: { position: 'bottom' }
      },
      scales: {
        x: {
          stacked: true,
          min: 0,
          max: 1200
        },
        y: {
          stacked: true
        }
      }
    }
  });

}

// --- Init ---
(function init() {
  checkHealth();
  loadThptCharts();
})();
