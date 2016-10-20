import React, { Component, PropTypes } from 'react';
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
  RangeSelector,
  AreaChart,
} from 'nud3';
import * as d3 from 'd3';
import LineTooltip from '../tooltips/LineTooltip';

export default class RangeSelectorChart extends Component {

  constructor (props, ...args) {
    super(props, ...args);
    this.state = {
      filteredData: props.data,
    };
    this.onRangeMove = this.onRangeMove.bind(this);
  }

  render () {
    const startDate = moment(_.first(this.props.data).date).toDate();
    const endDate = moment(_.last(this.props.data).date).toDate();
    const colorPalette = d3.scaleOrdinal(d3.schemeCategory10);

    const start = this.state.rangeStart || startDate;
    const end = this.state.rangeEnd || endDate;

    return (<g className="range-band-chart">
        <Chart
          className="basic-line-chart"
          data={ this.state.filteredData }
          xKey="date"
          valueKeys={ this.props.valueKeys }
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
              <LineTooltip position={ TooltipPositions.topRight } titleKeys={ this.props.titleKeys } />
            </VerticalHoverBar>
            <VerticalGrid />
            <HorizontalGrid />
          </PadDataBetweenDates>
        </Chart>
        <Chart
          className="basic-area-chart"
          data={ this.props.data }
          xKey="date"
          valueKeys={ this.props.valueKeys }
          height={ 100 }
          width= { 500 }
          paddingLeft={ 30 }
          paddingBottom={ 50 }
        >
          <PadDataBetweenDates startDate={ startDate } endDate={ endDate }>
            <AxisBottom textTransform="rotate(-45)" textDy="-0.25em" textDx="-0.75em" />
            <AreaChart transitionDuration={ 400 } transitionDelay={ 100 } />        
            <VerticalGrid />
            <RangeSelector onRangeMove={ this.onRangeMove }
                  range={ [start, end] }/>
          </PadDataBetweenDates>
        </Chart>
      </g>
    );
  }// end:render

  onRangeMove (start, end) {
    this.filterDataByDate(start, end);
  }

  filterDataByDate (start, end) {
    this.props.data
  }
}
RangeSelectorChart.propTypes = {
  data: React.PropTypes.array,
  valueKeys: React.PropTypes.array,
  titleKeys: React.PropTypes.array,
};
