import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardMetricsProps {
  data: {
    dates: string[];
    earnings: number[];
    gamePlays: number[];
  };
}

export default function DashboardMetrics({ data }: DashboardMetricsProps) {
  const lineChartData: ChartData<"line"> = {
    labels: data.dates,
    datasets: [
      {
        label: "Earnings",
        data: data.earnings,
        borderColor: "hsl(var(--chart-1))",
        backgroundColor: "hsla(var(--chart-1) / 0.1)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: "hsl(var(--chart-1))",
        pointBorderColor: "hsl(var(--background))",
        pointBorderWidth: 2,
        pointHoverRadius: 5,
      },
    ],
  };

  const barChartData: ChartData<"bar"> = {
    labels: data.dates,
    datasets: [
      {
        label: "Game Plays",
        data: data.gamePlays,
        backgroundColor: "hsla(var(--chart-3) / 0.7)",
        borderColor: "hsl(var(--chart-3))",
        borderWidth: 1,
        borderRadius: 4,
        hoverBackgroundColor: "hsl(var(--chart-3))",
      },
    ],
  };

  const lineOptions: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "hsl(var(--foreground))",
          font: {
            family: "'Inter', sans-serif",
          },
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "hsl(var(--card))",
        borderColor: "hsl(var(--border))",
        borderWidth: 1,
        titleColor: "hsl(var(--foreground))",
        bodyColor: "hsl(var(--foreground))",
        titleFont: {
          family: "'Inter', sans-serif",
          weight: "600",
        },
        bodyFont: {
          family: "'Inter', sans-serif",
        },
        padding: 12,
        boxPadding: 6,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
            }
            return label;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          color: "hsla(var(--border) / 0.3)",
        },
        ticks: {
          color: "hsl(var(--foreground))",
          font: {
            family: "'Inter', sans-serif",
          },
        },
      },
      y: {
        grid: {
          color: "hsla(var(--border) / 0.3)",
        },
        ticks: {
          color: "hsl(var(--foreground))",
          font: {
            family: "'Inter', sans-serif",
          },
          callback: function(value) {
            return new Intl.NumberFormat('en-US', { 
              style: 'currency', 
              currency: 'USD',
              maximumFractionDigits: 0
            }).format(Number(value));
          }
        },
      },
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
  };

  const barOptions: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "hsl(var(--foreground))",
          font: {
            family: "'Inter', sans-serif",
          },
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "hsl(var(--card))",
        borderColor: "hsl(var(--border))",
        borderWidth: 1,
        titleColor: "hsl(var(--foreground))",
        bodyColor: "hsl(var(--foreground))",
        titleFont: {
          family: "'Inter', sans-serif",
          weight: "600",
        },
        bodyFont: {
          family: "'Inter', sans-serif",
        },
        padding: 12,
        boxPadding: 6,
      },
    },
    scales: {
      x: {
        grid: {
          color: "hsla(var(--border) / 0.3)",
        },
        ticks: {
          color: "hsl(var(--foreground))",
          font: {
            family: "'Inter', sans-serif",
          },
        },
      },
      y: {
        grid: {
          color: "hsla(var(--border) / 0.3)",
        },
        ticks: {
          color: "hsl(var(--foreground))",
          font: {
            family: "'Inter', sans-serif",
          },
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium pl-2 mb-2">Earnings Over Time</h3>
        <div className="h-[300px]">
          <Line data={lineChartData} options={lineOptions} />
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium pl-2 mb-2">Game Activity</h3>
        <div className="h-[300px]">
          <Bar data={barChartData} options={barOptions} />
        </div>
      </div>
    </div>
  );
}
