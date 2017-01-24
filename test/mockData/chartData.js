import { scaleLinear } from 'd3';

const chartData = [[
  {
    xKey: 'xKey',
    yKey: 'yKey',
    xValue: 0,
    yValue: 0,
    original: {
      xKey: 0,
      yKey: 0,
    },
  },
  {
    xKey: 'xKey',
    yKey: 'yKey',
    xValue: 1,
    yValue: 1,
    original: {
      xKey: 1,
      yKey: 1,
    },
  },
  {
    xKey: 'xKey',
    yKey: 'yKey',
    xValue: 2,
    yValue: 2,
    original: {
      xKey: 2,
      yKey: 2,
    },
  },
  {
    xKey: 'xKey',
    yKey: 'yKey',
    xValue: 3,
    yValue: 3,
    original: {
      xKey: 3,
      yKey: 3,
    },
  },
]];


const originalData = chartData.map(d => d.original);
const yScale = scaleLinear().domain([0, 3]).range(0, 100);
const xScale = scaleLinear().domain([0, 3]).range(0, 100);
const valueKeys = ['xKey'];

export {
  chartData,
  yScale,
  xScale,
  valueKeys,
  originalData,
};
