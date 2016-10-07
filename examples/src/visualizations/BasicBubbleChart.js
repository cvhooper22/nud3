import React from 'react';
import { Chart, BubbleChart } from 'nud3';

export default function BasicBubbleChart (props) {
  const determineColor = (d) => {
    const data = d.data.original || {};
    if (data.sentiment_negative > data.sentiment_positive) {
      return '#090';
    } else if (data.sentiment_negative < data.sentiment_positive) {
      return '#900';
    }
    return '#999';
  };
  const labelFormat = (d) => {
    const data = d.data.original || {};
    return data.date;
  };
  return (
    <Chart
      className="basic-bubble-chart"
      data={ props.data }
      valueKeys={ props.valueKeys }
      height={ 500 }
      paddingLeft={ 30 }
      paddingBottom={ 30 }
      paddingRight={ 30 }
      paddingTop={ 30 }
    >
      <BubbleChart
        fillColor={ determineColor }
        labelFormat={ labelFormat }
      />
    </Chart>
  );
}
BasicBubbleChart.propTypes = {
  data: React.PropTypes.array,
  valueKeys: React.PropTypes.array,
};
