import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import {
  Chart,
  LineChart,
  AxisBottom,
  AxisLeft,
  PadDataBetweenDates,
  HorizontalHoverBar,
  VerticalHoverBar,
  TooltipPositions,
  VerticalGrid,
  HorizontalGrid,
} from 'nud3';
import * as d3 from 'd3';
import LineTooltip from '../tooltips/LineTooltip';

export default function BasicLineChart (props) {
  const startDate = moment(_.first(props.data).date).toDate();
  const endDate = moment(_.last(props.data).date).toDate();
  const colorPalette = d3.scaleOrdinal(d3.schemeCategory10);
  return (
    <Chart
      className="basic-line-chart"
      data={ props.data }
      xKey="date"
      valueKeys={ props.valueKeys }
      height={ 300 }
      paddingLeft={ 30 }
      paddingBottom={ 50 }
    >
      <AxisLeft />
      <PadDataBetweenDates startDate={ startDate } endDate={ endDate }>
        <AxisBottom textTransform="rotate(-45)" textDy="-0.25em" textDx="-0.75em" />
        <LineChart
          colorPalette={ colorPalette }
          transitionDuration={ 400 }
          transitionDelay={ 100 }
        />
        <HorizontalHoverBar barWidth={ 2 } />
        <VerticalHoverBar barWidth={ 2 }>
          <LineTooltip position={ TooltipPositions.topRight } titleKeys={ props.titleKeys } />
        </VerticalHoverBar>
        <VerticalGrid />
        <HorizontalGrid />
      </PadDataBetweenDates>
    </Chart>
  );
}
BasicLineChart.propTypes = {
  data: React.PropTypes.array,
  valueKeys: React.PropTypes.array,
  titleKeys: React.PropTypes.array,
};
