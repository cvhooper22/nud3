import React from 'react';
import MockSeriesData from '../../data/MockSeriesData.json';
import BasicPieChart from '../../visualizations/BasicPieChart';

export default function BasicPieChartView () {
  return (
    <BasicPieChart
      data={ MockSeriesData }
      valueKeys={ ['sentiment_positive'] }
      height={ 500 }
    />
  );
}
