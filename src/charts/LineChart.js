import React, { Component, PropTypes } from 'react';
import * as d3 from 'd3';
import _ from 'lodash';

const stringOrArrayOfStrings = PropTypes.oneOfType([
  PropTypes.string,
  React.PropTypes.arrayOf(PropTypes.string),
]);

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
  };

  constructor (...args) {
    super(...args);
    this.getUniqueDataKey = ::this.getUniqueDataKey;
    this.getStrokeColor = ::this.getStrokeColor;
    this.line = d3.line()
      .x(d => this.props.xScale(d.xValue))
      .y(d => this.props.yScale(d.yValue || 0));
  }

  componentDidMount () {
    this.renderLine();
  }

  componentDidUpdate () {
    this.renderLine();
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
        ref={ n => this.node = n }
        transform={ `translate(${this.props.paddingLeft},${this.props.paddingTop})` }
        clipPath={ this.props.clipPath }
      />
    );
  }

  renderLine () {
    this.group = d3.select(this.node);
    const paths = this.group.selectAll('.line-chart__line')
      .data(this.props.chartData, this.getUniqueDataKey)
      .enter()
      .append('path');
    paths
      .attr('class', 'line-chart__line')
      .style('stroke', this.getStrokeColor);
    if (this.props.filter) {
      paths.style('filter', ::this.getPathFilter);
    }


    this.group
      .selectAll('.line-chart__line')
        .attr('d', this.line);
  }
}
