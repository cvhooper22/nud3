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
    mask: stringOrArrayOfStrings,
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
    transition: PropTypes.func,
    DEBUG: PropTypes.bool,
  };

  static defaultProps = {
    transitionDelay: 0,
    transitionDuration: 0,
    transitionEase: d3.easePolyInOut,
  };

  componentDidMount () {
    this.renderChart();
  }

  componentDidUpdate () {
    this.renderChart();
  }

  getTransition () {
    const ease = _.isFunction(this.props.transitionEase) ? this.props.transitionEase : d3[this.props.transitionEase];
    if (this.props.transition) {
      return this.props.transition;
    }
    return d3.transition()
      .duration(this.props.transitionDuration)
      .delay(this.props.transitionDelay)
      .ease(ease);
  }

  getStrokeColor = (d, i) => {
    if (this.props.colorPalette) {
      if (_.isFunction(this.props.colorPalette)) {
        return this.props.colorPalette(i);
      } else {
        return this.props.colorPalette[i];
      }
    }
    return '';
  }

  getUniqueDataKey = (dataSet, i) => {
    return `${this.props.valueKeys[i]}`;
  }

  getPathFilter = (d, i) => {
    let filter = this.props.filter;
    if (_.isArray(filter)) {
      filter = filter[i];
    }
    if (filter) {
      return `url(#${filter})`;
    }
    return null;
  }

  getPathMask = (d, i) => {
    let mask = this.props.mask;
    if (_.isArray(mask)) {
      mask = mask[i];
    }
    if (mask) {
      return `url(#${mask})`;
    }
    return null;
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
    if (this.props.DEBUG) {
      /* eslint-disable no-console */
      console.debug('LineChart render chartData', this.props.chartData);
    }
    const enterLineGenerator = d3.line()
      .x(d => this.props.xScale(d.xValue))
      .y(() => this.props.yScale(this.props.yScale.domain()[0]));

    const lineGenerator = d3.line()
      .x(d => this.props.xScale(d.xValue))
      .y(d => this.props.yScale(d.yValue || 0));

    const paths = this.lines.selectAll('.line-chart__line')
      .data(this.props.chartData, this.getUniqueDataKey);

    paths
      .exit()
      .transition(this.getTransition())
      .attr('d', enterLineGenerator)
      .remove();

    paths
      .enter()
      .append('path')
      .attr('class', 'line-chart__line')
      .attr('d', enterLineGenerator)
      .merge(paths)
      .style('stroke', this.getStrokeColor)
      .style('filter', this.getPathFilter)
      .attr('mask', this.getPathMask)
      .transition(this.getTransition())
      .attr('d', lineGenerator);
  }
}
