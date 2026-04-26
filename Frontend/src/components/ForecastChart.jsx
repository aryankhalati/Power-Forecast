import { Bar, Line, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, PointElement, LineElement,
  ArcElement, Title, Tooltip, Legend, Filler,
} from 'chart.js'

ChartJS.register(
  CategoryScale, LinearScale, BarElement, PointElement, LineElement,
  ArcElement, Title, Tooltip, Legend, Filler
)

const tooltipPlugin = {
  backgroundColor: '#1a1a26',
  borderColor: 'rgba(255,255,255,0.08)',
  borderWidth: 1,
  titleColor: '#8888aa',
  bodyColor: '#f0f0f8',
  padding: 12,
  cornerRadius: 8,
}

/* ── Bar: Predicted vs Previous ── */
export function ComparisonChart({ predicted, previous }) {
  const data = {
    labels: ['Previous Month', 'Predicted Month'],
    datasets: [{
      data: [previous, predicted],
      backgroundColor: ['rgba(79,195,247,0.25)', 'rgba(240,192,64,0.3)'],
      borderColor: ['#4fc3f7', '#f0c040'],
      borderWidth: 2,
      borderRadius: 8,
      borderSkipped: false,
    }],
  }
  const options = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { plugins: { tooltip: tooltipPlugin } } },
    scales: {
      x: { grid: { color:'rgba(255,255,255,0.04)' }, ticks: { color:'#8888aa', font:{ size:12 } } },
      y: {
        grid: { color:'rgba(255,255,255,0.04)' },
        ticks: { color:'#8888aa', font:{ size:11 }, callback: v => `${v} kWh` },
        beginAtZero: true,
      },
    },
  }
  return (
    <div style={{ height:'220px' }}>
      <Bar data={data} options={options} />
    </div>
  )
}

/* ── Line: History trend ── */
export function TrendChart({ history }) {
  const labels = history.map((_, i) => `Record ${i + 1}`)
  const data = {
    labels,
    datasets: [
      {
        label: 'Predicted (kWh)',
        data: history.map(h => h.predicted),
        borderColor: '#f0c040', backgroundColor: 'rgba(240,192,64,0.08)',
        tension: 0.4, fill: true, pointRadius: 4, pointBackgroundColor: '#f0c040',
      },
    ],
  }
  const options = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color:'#8888aa', font:{ size:12 }, boxWidth:12, padding:16 },
        position: 'top',
      },
    },
    scales: {
      x: { grid: { color:'rgba(255,255,255,0.04)' }, ticks: { color:'#8888aa', font:{ size:11 } } },
      y: {
        grid: { color:'rgba(255,255,255,0.04)' },
        ticks: { color:'#8888aa', font:{ size:11 }, callback: v => `${v}` },
      },
    },
  }
  return (
    <div style={{ height:'260px' }}>
      <Line data={data} options={options} />
    </div>
  )
}

/* ── Doughnut: Breakdown ── */
export function BreakdownChart({ predicted }) {
  const ac         = Math.round(predicted * 0.45)
  const heating    = Math.round(predicted * 0.15)
  const lighting   = Math.round(predicted * 0.12)
  const appliances = Math.round(predicted * 0.18)
  const other      = predicted - ac - heating - lighting - appliances

  const data = {
    labels: ['AC / Cooling', 'Heating', 'Lighting', 'Appliances', 'Other'],
    datasets: [{
      data: [ac, heating, lighting, appliances, other],
      backgroundColor: [
        'rgba(240,192,64,0.8)', 'rgba(255,107,53,0.7)',
        'rgba(79,195,247,0.7)', 'rgba(57,217,138,0.7)', 'rgba(136,136,170,0.5)',
      ],
      borderColor: 'var(--bg2)',
      borderWidth: 3,
      hoverOffset: 6,
    }],
  }
  const options = {
    responsive: true, maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'right',
        labels: { color:'#8888aa', font:{ size:12 }, boxWidth:10, padding:12 },
      },
    },
  }
  return (
    <div style={{ height:'220px' }}>
      <Doughnut data={data} options={options} />
    </div>
  )
}