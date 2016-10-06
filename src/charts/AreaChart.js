import React, { Component, PropTypes } from 'react';
import * as d3 from 'd3';
import _ from 'lodash';

const stringOrArrayOfStrings = PropTypes.oneOfType([
  PropTypes.string,
  React.PropTypes.arrayOf(PropTypes.string),
]);

export default class AreaChart extends Component {

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
    height: PropTypes.number,
    areaHeight: PropTypes.number,
    clipPath: PropTypes.string,
  };

  constructor (...args) {
    super(...args);
    this.getUniqueDataKey = ::this.getUniqueDataKey;
    this.getFillColor = ::this.getFillColor;
    this.area = d3.area()
      .x(d => this.props.xScale(d.xValue))
      .y1(d => this.props.yScale(d.yValue || 0))
      .y0(() => this.props.areaHeight);
  }

  componentDidMount () {
    this.renderArea();
  }

  componentDidUpdate () {
    this.renderArea();
  }

  getFillColor (d, i) {
    if (_.isFunction(this.props.colorPalette)) {
      return this.props.colorPalette(i);
    }
    return this.props.colorPalette[i];
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
      'area-chart',
    ];
    if (this.props.classNamePrefix) {
      className.push(`${this.props.classNamePrefix}__area-chart`);
    }
    if (this.props.className) {
      className.push(this.props.className);
    }
    return (
      <g
        className={ className.join(' ') }
        transform={ `translate(${this.props.paddingLeft},${this.props.paddingTop})` }
        clipPath={ this.props.clipPath }
        ref={ n => this.node = n }
      />
    );
  }

  renderArea () {
    this.group = d3.select(this.node);
    const paths = this.group.selectAll('.area-chart__area')
      .data(this.props.chartData, this.getUniqueDataKey)
      .enter()
        .append('path');
    paths
      .attr('class', 'area-chart__area');
    if (this.props.filter) {
      paths.style('filter', ::this.getPathFilter);
    }

    const areas = this.group
      .selectAll('.area-chart__area')
      .attr('d', this.area)
    if (this.props.colorPalette) {
      areas.style('fill', this.getFillColor);
    }
  }
}
