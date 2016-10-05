import React, { Component, PropTypes } from 'react';
import * as d3 from 'd3';
import _ from 'lodash';

const stringOrArrayOfStrings = PropTypes.oneOfType([
  PropTypes.string,
  React.PropTypes.arrayOf(PropTypes.string),
]);

export default class BarChart extends Component {

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
    areaWidth: PropTypes.number,
    areaHeight: PropTypes.number,
    groupPadding: PropTypes.number,
    barPadding: PropTypes.number,
  };

  static defaultProps = {
    groupPadding: 12,
    barPadding: 2,
  };

  constructor (...args) {
    super(...args);
    this.getUniqueDataKey = ::this.getUniqueDataKey;
    this.getFillColor = ::this.getFillColor;
    this.getPathFilter = ::this.getPathFilter;
  }

  componentDidMount () {
    this.renderChart();
  }

  componentDidUpdate () {
    this.renderChart();
  }

  getFillColor (d, i) {
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

  getBarAreaWidth () {
    const sections = this.props.chartData.length;
    const bars = (this.props.chartData[0] || []).length;
    const totalBarCount = sections * bars;
    let barWidth = 0;
    if (totalBarCount) {
      barWidth = (this.props.areaWidth - (sections * this.props.groupPadding)) / totalBarCount;
    }
    return barWidth;
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
    const groups = this.group.selectAll('.bar-chart__group')
      .data(this.props.chartData, this.getUniqueDataKey)
      .enter()
      .append('g')
      .attr('class', 'bar-chart__group')
      .attr('transform', (d, i) => `translate(${i * barAreaWidth},0)`)
      .style('fill', this.getFillColor);
    if (this.props.filter) {
      groups.style('filter', this.getPathFilter);
    }
    this.renderGroupedBars(barAreaWidth - this.props.barPadding);
  }

  renderGroupedBars (barWidth) {
    const groups = this.group.selectAll('.bar-chart__group');
    const rects = groups.selectAll('.bar-chart__group__bar')
      .data(d => d)
      .enter()
      .append('rect');
    rects
      .attr('class', 'bar-chart__group__bar');
    if (this.props.filter) {
      rects.style('filter', this.getPathFilter);
    }

    groups
      .selectAll('.bar-chart__group__bar')
      .attr('width', barWidth)
      .attr('y', d => this.props.yScale(d.yValue || 0))
      .attr('x', d => this.props.xScale(d.xValue))
      .attr('height', d => (this.props.areaHeight - this.props.yScale(d.yValue || 0)) || 1);
  }

}
