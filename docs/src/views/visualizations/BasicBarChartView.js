import React from 'react';
import MockSeriesData from '../../data/MockSeriesData.json';
import BasicBarChart from '../../visualizations/BasicBarChart';

export default function BasicBarChartView () {
  return (
    <BasicBarChart
      data={ MockSeriesData }
      valueKeys={ ['mentions_total'] }
    />
  );
}
