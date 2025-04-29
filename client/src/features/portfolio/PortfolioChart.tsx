import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  ChartData,
  ChartOptions
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
);

interface PortfolioChartProps {
  labels: string[];
  data: number[];
}

export default function PortfolioChart({ labels, data }: PortfolioChartProps) {
  const chartData: ChartData<"line"> = {
    labels,
    datasets: [
      {
        label: "Portfolio Value",
        data,
        borderColor: "hsl(var(--chart-1))",
        backgroundColor: "hsla(var(--chart-1) / 0.2)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
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
          size: 12,
        },
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 12,
        },
        padding: 8,
        boxPadding: 4,
        callbacks: {
          label: function(context) {
            if (context.parsed.y !== null) {
              return new Intl.NumberFormat('en-US', { 
                style: 'currency', 
                currency: 'USD'
              }).format(context.parsed.y);
            }
            return '';
          }
        }
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
        beginAtZero: false,
      },
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
    elements: {
      line: {
        tension: 0.4,
      },
      point: {
        radius: 0,
      },
    },
  };

  return <Line data={chartData} options={options} />;
}
