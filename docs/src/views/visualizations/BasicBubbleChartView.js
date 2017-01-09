import React from 'react';
import MockSeriesData from '../../data/MockSeriesData.json';
import BasicBubbleChart from '../../visualizations/BasicBubbleChart';

export default function BasicBubbleChartView () {
  return (
    <BasicBubbleChart
      data={ MockSeriesData }
      valueKeys={ ['mentions_total'] }
    />
  );
}
