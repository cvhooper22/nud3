import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import {
  Chart,
  LineChart,
  AxisBottom,
  AxisLeft,
  PadDataBetweenDates,
  VerticalGrid,
  HorizontalGrid,
  RangeSelector,
  AreaChart,
} from 'nud3';
import * as d3 from 'd3';

export default class RangeSelectorChart extends Component {

  static propTypes = {
    data: React.PropTypes.array,
    valueKeys: React.PropTypes.array,
    titleKeys: React.PropTypes.array,
  };

  constructor (props, ...args) {
    super(props, ...args);
    this.state = {
      rangeStart: moment(_.last(this.props.data).date).subtract(3, 'days').toDate(),
      rangeEnd: moment(_.last(this.props.data).date).toDate(),
    };

    this.onRangeChange = this.onRangeChange.bind(this);
  }

  onRangeChange (rangeStart, rangeEnd) {
    this.setState({
      rangeStart,
      rangeEnd,
    });
  }

  render () {
    const startDate = moment(_.first(this.props.data).date).toDate();
    const endDate = moment(_.last(this.props.data).date).toDate();
    const colorPalette = d3.scaleOrdinal(d3.schemeCategory10);

    return (
      <g className="range-band-chart">
        <Chart
          className="basic-line-chart"
          data={ this.props.data }
          xKey="date"
          valueKeys={ this.props.valueKeys }
          height={ 300 }
          paddingLeft={ 30 }
          paddingBottom={ 50 }
        >
          <AxisLeft />
          <PadDataBetweenDates startDate={ this.state.rangeStart } endDate={ this.state.rangeEnd }>
            <AxisBottom textTransform="rotate(-45)" textDy="-0.25em" textDx="-0.75em" />
            <LineChart
              colorPalette={ colorPalette }
              transitionDuration={ 400 }
              transitionDelay={ 100 }
            />
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
          paddingLeft={ 30 }
          paddingBottom={ 50 }
        >
          <PadDataBetweenDates startDate={ startDate } endDate={ endDate }>
            <AxisBottom textTransform="rotate(-45)" textDy="-0.25em" textDx="-0.75em" />
            <AreaChart transitionDuration={ 400 } transitionDelay={ 100 } />
            <VerticalGrid />
            <RangeSelector
              onRangeChange={ this.onRangeChange }
              handleWidth={ 5 }
              minClipSize={ 1000 * 60 * 60 }
              maxClipSize={ 1000 * 60 * 60 * 24 * 7 }
              start={ this.state.rangeStart }
              end={ this.state.rangeEnd }
            />
          </PadDataBetweenDates>
        </Chart>
      </g>
    );
  }
}
