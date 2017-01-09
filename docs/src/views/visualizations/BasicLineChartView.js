import React from 'react';
import MockSeriesData from '../../data/MockSeriesData.json';
import BasicLineChart from '../../visualizations/BasicLineChart';

export default function BasicLineChartView () {
  return (
    <BasicLineChart
      data={ MockSeriesData }
      valueKeys={ ['mentions_total', 'sentiment_negative', 'sentiment_positive'] }
      titleKeys={ ['Mentions', 'Negative Sentiment', 'Positive Sentiment'] }
    />
  );
}
