import React from 'react';
import Chart from 'react-apexcharts';

const ScatterLineChart = () => {
  // Generate random data points for demonstration
  const generateDataPoints = (numPoints:any) => {
    let data = [];
    for (let i = 0; i < numPoints; i++) {
      data.push({
        x: i + 1,
        y: parseFloat((Math.random() * 10).toFixed(2)) // Random y values between 0 and 10
      });
    }
    return data;
  };

  const options:any = {
    series: [
      {
        name: 'Points',
        type: 'scatter',
        data: generateDataPoints(50) // Generate 50 points for the scatter plot
      },
      {
        name: 'Line',
        type: 'line',
        data: generateDataPoints(50) // Generate 50 points for the line plot
      }
    ],
    chart: {
      height: 350,
      type: 'line',
    },
    fill: {
      type: 'solid',
    },
    markers: {
      size: [6, 0],
    },
    tooltip: {
      shared: false,
      intersect: true,
    },
    legend: {
      show: false,
    },
    xaxis: {
      type: 'numeric',
      min: 0,
      max: 50, // Adjust max to the number of data points
      tickAmount: 12,
    },
  };

  return (
    <div id="chart">
      <Chart options={options} series={options.series} type="line" height={350} />
    </div>
  );
};

export default ScatterLineChart;
