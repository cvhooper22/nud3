import React from 'react';
import MockSeriesData from '../../data/MockSeriesData.json';
import BasicAreaChart from '../../visualizations/BasicAreaChart';

export default function BasicAreaChartView () {
  return (
    <BasicAreaChart
      data={ MockSeriesData }
      valueKeys={ ['mentions_total'] }
    />
  );
}
