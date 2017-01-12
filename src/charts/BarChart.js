import React, { Component, PropTypes } from 'react';
import * as d3 from 'd3';
import _ from 'lodash';
import { stringOrArrayOfStrings, stringOrFunc } from '../propTypes/customPropTypes';

export default class BarChart extends Component {

  static propTypes = {
    chartData: PropTypes.array,
    className: PropTypes.string,
    classNamePrefix: PropTypes.string,
    colorPalette: PropTypes.any,
    fill: PropTypes.bool,
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
    areaWidth: PropTypes.number,
    areaHeight: PropTypes.number,
    transitionDuration: PropTypes.number,
    transitionDelay: PropTypes.number,
    transitionEase: stringOrFunc,
    transition: PropTypes.func,
    groupPadding: PropTypes.any,
  };

  static defaultProps = {
    fill: true,
    transitionDelay: 0,
    transitionDuration: 0,
    transitionEase: d3.easePolyInOut,
    groupPadding: 0.1,
  };

  componentDidMount () {
    this.renderChart();
  }

  componentDidUpdate () {
    this.renderChart();
  }

  getFillFromColorPalette = (d, i) => {
    if (this.props.colorPalette) {
      if (_.isFunction(this.props.colorPalette)) {
        return this.props.colorPalette(i);
      } else if (_.isArray(this.props.colorPalette)) {
        return this.props.colorPalette[i];
      } else {
        return this.props.colorPalette;
      }
    }
    return null;
  }

  getUniqueDataKey = (dataSet, i) => {
    return `${this.props.valueKeys[i]}`;
  }

  getUniqueItemKey = (datum, i) => {
    return `${datum.xValue || i}`;
  }

  getFilter = (d, i) => {
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

  render () {
    const className = [
      'bar-chart',
    ];
    if (this.props.classNamePrefix) {
      className.push(`${this.props.classNamePrefix}__bar-chart`);
    }
    if (this.props.className) {
      className.push(this.props.className);
    }
    return (
      <g
        className={ className.join(' ') }
        ref={ n => this.node = d3.select(n) }
        transform={ `translate(${this.props.paddingLeft},${this.props.paddingTop})` }
        clipPath={ this.props.clipPath }
      />
    );
  }

  renderChart () {
    const groups = this.node.selectAll('.bar-chart__group')
      .data(this.props.chartData, this.getUniqueDataKey);

    groups
      .exit()
      .remove();

    groups
      .enter()
      .append('g')
      .attr('class', 'bar-chart__group')
      .merge(groups)
      .style('fill', this.getFillFromColorPalette)
      .attr('mask', this.getPathMask);
    this.renderGroupedBars();
  }

  renderGroupedBars () {
    const xScale = this.props.xScale.copy();
    const bottomY = this.props.yScale(this.props.yScale.domain()[0]);
    xScale.range([0, this.props.xScale.bandwidth()]);
    xScale.domain(this.props.valueKeys);

    const groups = this.node.selectAll('.bar-chart__group');
    const bars = groups.selectAll('.bar-chart__group__bar')
      .data(d => d, this.getUniqueItemKey);

    bars
      .exit()
      .transition(this.getTransition())
      .attr('y', bottomY)
      .attr('width', 0)
      .remove();

    bars
      .enter()
      .append('rect')
      .attr('class', 'bar-chart__group__bar')
      .attr('height', 0)
      .attr('width', 0)
      .attr('x', d => xScale(d.yKey) + this.props.xScale(d.xValue))
      .attr('y', bottomY)
    .merge(bars)
      .style('filter', this.getFilter)
      .transition(this.getTransition())
      .attr('x', d => xScale(d.yKey) + this.props.xScale(d.xValue))
      .attr('width', xScale.bandwidth())
      .attr('y', d => this.props.yScale(d.yValue || 0))
      .attr('height', d => (this.props.areaHeight - this.props.yScale(d.yValue || 0)) || 1);
  }

}
