import { useEffect, useState } from "react";
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
  Filler,
  ChartOptions
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface GamingStatsProps {
  isSpending?: boolean;
}

export function GamingStats({ isSpending = false }: GamingStatsProps) {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    if (isSpending) {
      setChartData({
        labels,
        datasets: [
          {
            label: 'Game Purchases',
            data: [65, 45, 75, 59, 80, 81, 56, 55, 72, 88, 95, 101],
            backgroundColor: 'hsl(var(--chart-1) / 0.5)',
            borderColor: 'hsl(var(--chart-1))',
            borderWidth: 2,
          },
          {
            label: 'In-Game Items',
            data: [28, 48, 40, 19, 86, 27, 90, 35, 42, 50, 64, 55],
            backgroundColor: 'hsl(var(--chart-2) / 0.5)',
            borderColor: 'hsl(var(--chart-2))',
            borderWidth: 2,
          },
          {
            label: 'Subscriptions',
            data: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
            backgroundColor: 'hsl(var(--chart-3) / 0.5)',
            borderColor: 'hsl(var(--chart-3))',
            borderWidth: 2,
          }
        ]
      });
    } else {
      setChartData({
        labels,
        datasets: [
          {
            label: 'Playtime (hours)',
            data: [85, 72, 78, 75, 82, 98, 101, 120, 118, 110, 105, 124],
            borderColor: 'hsl(var(--chart-1))',
            backgroundColor: 'hsl(var(--chart-1) / 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.3
          },
          {
            label: 'Win Rate (%)',
            data: [48, 52, 54, 55, 58, 60, 59, 62, 65, 63, 60, 62],
            borderColor: 'hsl(var(--chart-2))',
            backgroundColor: 'transparent',
            borderWidth: 2,
            fill: false,
            tension: 0.3,
            yAxisID: 'y1'
          }
        ]
      });
    }
  }, [isSpending]);

  const options: ChartOptions<'line' | 'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'hsl(var(--foreground))',
          font: {
            family: "'Inter', sans-serif"
          }
        }
      },
      tooltip: {
        backgroundColor: 'hsl(var(--background))',
        titleColor: 'hsl(var(--foreground))',
        bodyColor: 'hsl(var(--foreground) / 0.8)',
        borderColor: 'hsl(var(--border))',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        bodyFont: {
          family: "'Inter', sans-serif"
        },
        titleFont: {
          family: "'Inter', sans-serif",
          weight: '600'
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'hsl(var(--border) / 0.3)',
        },
        ticks: {
          color: 'hsl(var(--foreground) / 0.8)'
        }
      },
      y: {
        grid: {
          color: 'hsl(var(--border) / 0.3)',
        },
        ticks: {
          color: 'hsl(var(--foreground) / 0.8)'
        },
        beginAtZero: true
      },
      ...(isSpending ? {} : {
        y1: {
          position: 'right' as const,
          grid: {
            display: false,
          },
          ticks: {
            color: 'hsl(var(--foreground) / 0.8)'
          },
          min: 0,
          max: 100
        }
      })
    }
  };

  if (chartData.labels.length === 0) return <div>Loading chart...</div>;

  return isSpending ? (
    <Bar data={chartData} options={options} />
  ) : (
    <Line data={chartData} options={options} />
  );
}
