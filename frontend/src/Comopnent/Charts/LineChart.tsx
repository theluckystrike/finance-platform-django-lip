import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';

// Register the necessary Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const Utils = {
  // Utils functions (e.g., numbers, months, namedColor, transparentize) should be defined here
  numbers: ({ count, min, max }: { count: number; min: number; max: number }) => {
    return Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1)) + min);
  },
  months: ({ count }: { count: number }) => {
    return Array.from({ length: count }, (_, i) => new Date(0, i).toLocaleString('en', { month: 'short' }));
  },
  namedColor: (index: number) => {
    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink'];
    return colors[index % colors.length];
  },
  transparentize: (color: string, opacity: number) => {
    return `${color}${Math.floor(opacity * 255).toString(16)}`;
  },
  CHART_COLORS: {
    red: 'rgba(255, 99, 132, 1)',
    blue: 'rgba(54, 162, 235, 1)',
    green:'#33d94c'
  },
};

const LineChart  = () => {
  const DATA_COUNT = 7;
  const NUMBER_CFG = { count: DATA_COUNT, min: -100, max: 100 };

  const data = {
    labels: Utils.months({ count: DATA_COUNT }),
    datasets: [
      {
        label: 'GDX/GLD ',
        data: Utils.numbers(NUMBER_CFG),
        borderColor: Utils.CHART_COLORS.green,
        backgroundColor: Utils.transparentize(Utils.CHART_COLORS.green, 0.5),
      },
      {
        label: '50-day Moving Avgerage',
        data: Utils.numbers(NUMBER_CFG),
        borderColor: Utils.CHART_COLORS.blue,
        backgroundColor: Utils.transparentize(Utils.CHART_COLORS.blue, 0.5),
      },
      {
        label: '200-day Moving Avgerage',
        data: Utils.numbers(NUMBER_CFG),
        borderColor: Utils.CHART_COLORS.red,
        backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '',
      },
    },
  };
 

 
  return (
    <div>
      <Line data={data} options={options} />
       
    </div>
  );
};

export default LineChart;
