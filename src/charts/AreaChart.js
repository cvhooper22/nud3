import React, { Component, PropTypes } from 'react';
import * as d3 from 'd3';
import _ from 'lodash';
import { stringOrFunc } from '../propTypes/customPropTypes';

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
    transitionDuration: PropTypes.number,
    transitionDelay: PropTypes.number,
    transitionEase: stringOrFunc,
  };

  static defaultProps = {
    transitionDelay: 0,
    transitionDuration: 0,
    transitionEase: d3.easePolyInOut,
  };

  constructor (...args) {
    super(...args);
    this.getUniqueDataKey = ::this.getUniqueDataKey;
    this.getFillColor = ::this.getFillColor;
    this.getPathFilter = ::this.getPathFilter;
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
    const enterAreaGenerator = d3.area()
      .x(d => this.props.xScale(d.xValue))
      .y1(() => this.props.yScale(this.props.yScale.domain()[0]))
      .y0(() => this.props.areaHeight);

    const areaGenerator = d3.area()
      .x(d => this.props.xScale(d.xValue))
      .y1(d => this.props.yScale(d.yValue || 0))
      .y0(() => this.props.areaHeight);
    this.group = d3.select(this.node);
    const paths = this.group.selectAll('.area-chart__area')
      .data(this.props.chartData, this.getUniqueDataKey)
      .enter()
      .append('path')
      .attr('d', enterAreaGenerator);
    if (this.props.colorPalette) {
      paths.style('fill', this.getFillColor);
    }
    paths
      .attr('class', 'area-chart__area');
    if (this.props.filter) {
      paths.style('filter', this.getPathFilter);
    }

    const ease = _.isFunction(this.props.transitionEase) ? this.props.transitionEase : d3[this.props.transitionEase];
    const areas = this.group
      .selectAll('.area-chart__area')
      .transition()
      .duration(this.props.transitionDuration)
      .delay(this.props.transitionDelay)
      .ease(ease)
      .attr('d', areaGenerator);
    if (this.props.colorPalette) {
      areas.style('fill', this.getFillColor);
    }
  }
}
