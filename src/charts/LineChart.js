import React, { Component, PropTypes } from 'react';
import * as d3 from 'd3';
import _ from 'lodash';
import { stringOrArrayOfStrings, stringOrFunc } from '../propTypes/customPropTypes';

export default class LineChart extends Component {

  static propTypes = {
    chartData: PropTypes.array,
    className: PropTypes.string,
    classNamePrefix: PropTypes.string,
    colorPalette: PropTypes.any,
    filter: stringOrArrayOfStrings,
    paddingBottom: PropTypes.number,
    paddingLeft: PropTypes.number,
    paddingRight: PropTypes.number,
    paddingTop: PropTypes.number,
    valueKeys: PropTypes.array,
    xScale: PropTypes.func,
    yScale: PropTypes.func,
    clipPath: PropTypes.string,
    transitionDuration: PropTypes.number,
    transitionDelay: PropTypes.number,
    transitionEase: stringOrFunc,
  };

  static defaultProps = {
    transitionDelay: 0,
    transitionDuration: 0,
    transitionEase: d3.easePolyInOut,
  };

  constructor (props, ...args) {
    super(props, ...args);
    this.getUniqueDataKey = ::this.getUniqueDataKey;
    this.getStrokeColor = ::this.getStrokeColor;
    this.getPathFilter = ::this.getPathFilter;
  }

  componentDidMount () {
    this.renderChart();
  }

  componentDidUpdate () {
    this.renderChart();
  }

  getStrokeColor (d, i) {
    if (this.props.colorPalette) {
      if (_.isFunction(this.props.colorPalette)) {
        return this.props.colorPalette(i);
      } else {
        return this.props.colorPalette[i];
      }
    }
    return '';
  }

  getUniqueDataKey (dataSet, i) {
    return this.props.valueKeys[i];
  }

  getPathFilter (d, i) {
    let filter = this.props.filter;
    if (_.isArray(filter)) {
      filter = filter[i];
    }
    return `url(#${filter})`;
  }

  render () {
    const className = [
      'line-chart',
    ];
    if (this.props.classNamePrefix) {
      className.push(`${this.props.classNamePrefix}__line-chart`);
    }
    if (this.props.className) {
      className.push(this.props.className);
    }
    return (
      <g
        className={ className.join(' ') }
        transform={ `translate(${this.props.paddingLeft},${this.props.paddingTop})` }
        clipPath={ this.props.clipPath }
        ref={ n => this.lines = d3.select(n) }
      />
    );
  }

  renderChart () {
    const enterLineGenerator = d3.line()
      .x(d => this.props.xScale(d.xValue))
      .y(() => this.props.yScale(this.props.yScale.domain()[0]));

    const lineGenerator = d3.line()
      .x(d => this.props.xScale(d.xValue))
      .y(d => this.props.yScale(d.yValue || 0));

    const paths = this.lines.selectAll('.line-chart__line')
      .data(this.props.chartData, this.getUniqueDataKey)
      .enter()
      .append('path')
      .attr('d', enterLineGenerator);
    paths
      .attr('class', 'line-chart__line');
    if (this.props.colorPalette) {
      paths.style('stroke', this.getStrokeColor);
    }
    if (this.props.filter) {
      paths.style('filter', this.getPathFilter);
    }

    const ease = _.isFunction(this.props.transitionEase) ? this.props.transitionEase : d3[this.props.transitionEase];

    this.lines
      .selectAll('.line-chart__line')
      .transition()
      .duration(this.props.transitionDuration)
      .delay(this.props.transitionDelay)
      .ease(ease)
      .attr('d', lineGenerator);
  }
}
