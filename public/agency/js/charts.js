/* ============================================
   JEFF CLINE AGENCY DASHBOARD - Chart.js Configs
   Revenue, Traffic, Sources, Expenses, CTV
   ============================================ */

// Common Chart.js defaults
Chart.defaults.color = '#94a3b8';
Chart.defaults.font.family = 'Inter, sans-serif';
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.legend.labels.padding = 16;
Chart.defaults.scale.grid = { color: 'rgba(255,255,255,0.04)' };
Chart.defaults.scale.border = { color: 'rgba(255,255,255,0.06)' };

// ---- OVERVIEW CHARTS ----
let revenueChartInstance = null;
let sourceChartInstance = null;

function initOverviewCharts() {
  initRevenueChart();
  initSourceChart();
}

function initRevenueChart() {
  const ctx = document.getElementById('revenueChart');
  if (!ctx) return;
  
  if (revenueChartInstance) revenueChartInstance.destroy();

  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  revenueChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Revenue',
          data: [4200, 5100, 4800, 6200, 7400, 5800, 7250],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: '#3b82f6',
          borderWidth: 2
        },
        {
          label: 'Traffic (K)',
          data: [18, 22, 19, 28, 32, 24, 35],
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.05)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: '#f59e0b',
          borderWidth: 2,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          backgroundColor: '#1a2235',
          borderColor: 'rgba(59, 130, 246, 0.2)',
          borderWidth: 1,
          padding: 12,
          titleFont: { weight: 600 },
          callbacks: {
            label: function(context) {
              if (context.dataset.label === 'Revenue') {
                return 'Revenue: $' + context.parsed.y.toLocaleString();
              }
              return 'Traffic: ' + context.parsed.y + 'K visitors';
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: val => '$' + (val/1000).toFixed(0) + 'K'
          }
        },
        y1: {
          position: 'right',
          beginAtZero: true,
          grid: { drawOnChartArea: false },
          ticks: {
            callback: val => val + 'K'
          }
        }
      }
    }
  });
}

function initSourceChart() {
  const ctx = document.getElementById('sourceChart');
  if (!ctx) return;
  
  if (sourceChartInstance) sourceChartInstance.destroy();

  sourceChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Organic Search', 'Paid Ads', 'Social Media', 'Direct', 'Referral', 'Email'],
      datasets: [{
        data: [42, 24, 14, 10, 6, 4],
        backgroundColor: [
          '#3b82f6',
          '#f59e0b',
          '#ec4899',
          '#10b981',
          '#8b5cf6',
          '#06b6d4'
        ],
        borderWidth: 0,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { padding: 12, font: { size: 11 } }
        },
        tooltip: {
          backgroundColor: '#1a2235',
          borderColor: 'rgba(59, 130, 246, 0.2)',
          borderWidth: 1,
          padding: 12,
          callbacks: {
            label: function(context) {
              return context.label + ': ' + context.parsed + '%';
            }
          }
        }
      }
    }
  });
}

// ---- EXPENSE CHART ----
let expenseChartInstance = null;

function initExpenseChart() {
  const ctx = document.getElementById('expenseChart');
  if (!ctx) return;
  
  if (expenseChartInstance) expenseChartInstance.destroy();

  const labels = ['Feb 6', 'Feb 7', 'Feb 8', 'Feb 9', 'Feb 10', 'Feb 11', 'Feb 12'];
  
  expenseChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Ad Spend',
          data: [1420, 1380, 1510, 1240, 1650, 1540, 1247],
          backgroundColor: 'rgba(239, 68, 68, 0.7)',
          borderRadius: 4,
          barPercentage: 0.6,
          stack: 'stack1'
        },
        {
          label: 'API Costs',
          data: [42, 38, 55, 41, 67, 48, 42],
          backgroundColor: 'rgba(245, 158, 11, 0.7)',
          borderRadius: 4,
          barPercentage: 0.6,
          stack: 'stack1'
        },
        {
          label: 'Subscriptions',
          data: [25, 25, 25, 25, 25, 25, 25],
          backgroundColor: 'rgba(139, 92, 246, 0.7)',
          borderRadius: 4,
          barPercentage: 0.6,
          stack: 'stack1'
        },
        {
          label: 'TV/CTV',
          data: [580, 600, 550, 620, 590, 610, 607],
          backgroundColor: 'rgba(59, 130, 246, 0.7)',
          borderRadius: 4,
          barPercentage: 0.6,
          stack: 'stack1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          backgroundColor: '#1a2235',
          borderColor: 'rgba(239, 68, 68, 0.2)',
          borderWidth: 1,
          padding: 12,
          callbacks: {
            label: function(context) {
              return context.dataset.label + ': $' + context.parsed.y.toLocaleString();
            },
            footer: function(items) {
              const total = items.reduce((sum, item) => sum + item.parsed.y, 0);
              return 'Total: $' + total.toLocaleString();
            }
          }
        }
      },
      scales: {
        x: { stacked: true },
        y: {
          stacked: true,
          beginAtZero: true,
          ticks: {
            callback: val => '$' + val.toLocaleString()
          }
        }
      }
    }
  });
}

// ---- CTV CHART ----
let ctvChartInstance = null;

function initCTVChart() {
  const ctx = document.getElementById('ctvChart');
  if (!ctx) return;
  
  if (ctvChartInstance) ctvChartInstance.destroy();

  ctvChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
      datasets: [
        {
          label: 'MNTN Impressions (K)',
          data: [120, 145, 168, 192, 210, 247],
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          fill: true,
          tension: 0.4,
          borderWidth: 2
        },
        {
          label: 'Vibe.com Impressions (K)',
          data: [80, 95, 112, 128, 148, 167],
          borderColor: '#06b6d4',
          backgroundColor: 'rgba(6, 182, 212, 0.1)',
          fill: true,
          tension: 0.4,
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          backgroundColor: '#1a2235',
          borderColor: 'rgba(139, 92, 246, 0.2)',
          borderWidth: 1,
          padding: 12
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { callback: val => val + 'K' }
        }
      }
    }
  });
}
