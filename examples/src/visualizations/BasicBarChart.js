import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import * as d3 from 'd3';
import { Chart, BarChart, AxisBottom, AxisLeft, PadDataBetweenDates } from 'nud3';

const colorPalette = d3.scaleOrdinal(d3.schemeCategory20);

export default function BasicBarChart (props) {
  const startDate = moment(_.first(props.data).date).toDate();
  const endDate = moment(_.last(props.data).date).toDate();
  const scaleCreator = () => {
    return d3.scaleBand().padding(0.1);
  };
  const xScaleDomain = (data) => {
    return _.first(data).map(d => d.xValue);
  };
  return (
    <Chart
      className="basic-bar-chart"
      data={ props.data }
      xKey="date"
      valueKeys={ props.valueKeys }
      height={ 300 }
      paddingLeft={ 30 }
      paddingBottom={ 50 }
      xScale={ scaleCreator }
      xScaleDomain={ xScaleDomain }
    >
      <AxisLeft />
      <PadDataBetweenDates startDate={ startDate } endDate={ endDate }>
        <AxisBottom tickFormat={ d3.timeFormat('%b %d') } />
        <BarChart colorPalette={ colorPalette } />
      </PadDataBetweenDates>
    </Chart>
  );
}
BasicBarChart.propTypes = {
  data: React.PropTypes.array,
  valueKeys: React.PropTypes.array,
};
