import React from 'react';
import { Chart, ChartData, registerables } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import ChartjsPluginStacked100 from 'chartjs-plugin-stacked100';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ChartOptions } from 'chart.js';

Chart.register(...registerables, ChartjsPluginStacked100, ChartDataLabels);

interface IPostVoteResultChart {
  agreeScore: number;
  neutralScore: number;
  disagreeScore: number;
}

interface IBarChart {
  data: ChartData<'bar'>;
  options: ChartOptions<'bar'>;
}

const calculatePercentages = (
  agreeScore: number,
  neutralScore: number,
  disagreeScore: number
) => {
  const total = agreeScore + neutralScore + disagreeScore;
  const agreePercentage = (agreeScore / total) * 100;
  const neutralPercentage = (neutralScore / total) * 100;
  const disagreePercentage = (disagreeScore / total) * 100;

  return [agreePercentage, neutralPercentage, disagreePercentage];
};

function PostVoteResultBarChart({ ...props }: IPostVoteResultChart) {
  const { agreeScore, neutralScore, disagreeScore } = props;
  const [agreePercentage, neutralPercentage, disagreePercentage] =
    calculatePercentages(agreeScore, neutralScore, disagreeScore);

  const BarData: ChartData<'bar'> = {
    labels: [''],
    datasets: [
      {
        label: '👍',
        data: [agreePercentage],
        backgroundColor: '#429CD9',
        barThickness: 40,
      },
      {
        label: '🙁',
        data: [neutralPercentage],
        backgroundColor: '#FBCD56',
        barThickness: 40,
      },
      {
        label: '👎',
        data: [disagreePercentage],
        backgroundColor: '#FB7B77',
        barThickness: 40,
      },
    ],
  };

  const chartOptions: ChartOptions<'bar'> = {
    scales: {
      x: {
        grid: {
          display: false,
          drawTicks: false,
        },
      },
      y: {
        display: false,
        grid: {
          display: false,
          drawTicks: false,
        },
      },
    },
    indexAxis: 'y',
    plugins: {
      stacked100: { enable: true },
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          pointStyle: 'rect',
        },
      },
      tooltip: {
        enabled: false,
      },
      datalabels: {
        formatter: function (value: number, context: any) {
          let idx = context.dataIndex;
          return context.chart.data.labels![idx] + value.toFixed(0) + '%';
        },
        color: 'white',
      },
    },
  };

  return <Bar data={BarData} options={chartOptions} />;
}

export default PostVoteResultBarChart;
