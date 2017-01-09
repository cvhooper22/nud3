import React from 'react';
import MockSeriesData from '../../data/MockSeriesData.json';
import ScatterLineChart from '../../visualizations/ScatterLineChart';

export default function ScatterLineChartView () {
  return (
    <ScatterLineChart
      data={ MockSeriesData }
      valueKeys={ ['mentions_total'] }
      titleKeys={ ['Mentions'] }
    />
  );
}
