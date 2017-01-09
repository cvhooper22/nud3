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
    groupPadding: PropTypes.number,
    barPadding: PropTypes.number,
    transitionDuration: PropTypes.number,
    transitionDelay: PropTypes.number,
    transitionEase: stringOrFunc,
  };

  static defaultProps = {
    barPadding: 2,
    fill: true,
    groupPadding: 12,
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
    return this.props.valueKeys[i];
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

  getBarAreaWidth = () => {
    const sections = this.props.chartData.length;
    const bars = (this.props.chartData[0] || []).length;
    const totalBarCount = sections * bars;
    let barWidth = 0;
    if (totalBarCount) {
      barWidth = (this.props.areaWidth - (sections * this.props.groupPadding)) / totalBarCount;
    }
    return barWidth;
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
        ref={ n => this.node = n }
        transform={ `translate(${this.props.paddingLeft},${this.props.paddingTop})` }
        clipPath={ this.props.clipPath }
      />
    );
  }

  renderChart () {
    this.group = d3.select(this.node);
    const barAreaWidth = this.getBarAreaWidth();
    this.group.selectAll('.bar-chart__group')
      .data(this.props.chartData, this.getUniqueDataKey)
      .enter()
      .append('g')
      .attr('class', 'bar-chart__group')
      .attr('transform', (d, i) => `translate(${i * barAreaWidth},0)`)
      .style('fill', this.getFillFromColorPalette)
      .style('filter', this.getPathFilter)
      .attr('mask', this.getPathMask);
    this.renderGroupedBars(barAreaWidth - this.props.barPadding);
  }

  renderGroupedBars (barWidth) {
    const groups = this.group.selectAll('.bar-chart__group');
    const bottomY = this.props.yScale(this.props.yScale.domain()[0]);
    groups.selectAll('.bar-chart__group__bar')
      .data(d => d)
      .enter()
      .append('rect')
      .attr('y', bottomY)
      .attr('height', 0)
      .attr('width', barWidth)
      .attr('x', d => this.props.xScale(d.xValue))
      .attr('class', 'bar-chart__group__bar');

    const ease = _.isFunction(this.props.transitionEase) ? this.props.transitionEase : d3[this.props.transitionEase];
    const rects = groups
      .selectAll('.bar-chart__group__bar')
      .transition()
      .duration(this.props.transitionDuration)
      .delay(this.props.transitionDelay)
      .ease(ease)
      .attr('width', barWidth)
      .attr('y', d => this.props.yScale(d.yValue || 0))
      .attr('x', d => this.props.xScale(d.xValue))
      .attr('height', d => (this.props.areaHeight - this.props.yScale(d.yValue || 0)) || 1);
    if (this.props.filter) {
      rects.style('filter', this.getPathFilter);
    } else {
      rects.style('filter', null);
    }
  }

}
