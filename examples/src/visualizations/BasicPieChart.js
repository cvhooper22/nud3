import React from 'react';
import * as d3 from 'd3';
import { Chart, PieChart } from 'nud3';

const colorPalette = d3.scaleOrdinal(d3.schemeCategory20);

export default function BasicPieChart (props) {
  const outerLabelFormat = (d, datum) => {
    return datum.data.original.date;
  };
  return (
    <Chart
      data={ props.data }
      valueKeys={ props.valueKeys }
      height={ props.height }
      paddingBottom={ 25 }
      paddingTop={ 25 }
    >
      <PieChart
        colorPalette={ colorPalette }
        labelFormat={ n => n }
        outerLabelFormat={ outerLabelFormat }
      />
    </Chart>
  );
}
BasicPieChart.propTypes = {
  data: React.PropTypes.array,
  valueKeys: React.PropTypes.array,
  height: React.PropTypes.number,
};
