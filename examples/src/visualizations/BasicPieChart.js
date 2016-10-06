import React from 'react';
import * as d3 from 'd3';
import { Chart, PieChart } from 'nud3';

const colorPalette = d3.scaleOrdinal(d3.schemeCategory20);

export default function BasicPieChart (props) {
  return (
    <Chart
      data={ props.data }
      valueKeys={ props.valueKeys }
      height={ props.height }
    >
      <PieChart
        colorPalette={ colorPalette }
        labelFormat={ n => n }
      />
    </Chart>
  );
}
BasicPieChart.propTypes = {
  data: React.PropTypes.array,
  valueKeys: React.PropTypes.array,
  height: React.PropTypes.number,
};
