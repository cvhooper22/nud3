import React from 'react';
import MockSeriesData from '../../data/MockSeriesData.json';
import FancyLineChart from '../../visualizations/FancyLineChart';

export default function FancyLineChartView () {
  return (
    <FancyLineChart
      data={ MockSeriesData }
      valueKeys={ ['mentions_total', 'sentiment_negative', 'sentiment_positive'] }
      titleKeys={ ['Mentions', 'Negative Sentiment', 'Positive Sentiment'] }
    />
  );
}
