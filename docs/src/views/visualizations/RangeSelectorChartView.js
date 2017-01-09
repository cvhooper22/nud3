import React from 'react';
import MockSeriesData from '../../data/MockSeriesData.json';
import RangeSelectorChart from '../../visualizations/RangeSelectorChart';

export default function RangeSelectorChartView () {
  return (
    <RangeSelectorChart
      data={ MockSeriesData }
      valueKeys={ ['mentions_total', 'sentiment_negative', 'sentiment_positive'] }
      titleKeys={ ['Mentions', 'Negative Sentiment', 'Positive Sentiment'] }
    />
  );
}
