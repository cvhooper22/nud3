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
    mask: stringOrArrayOfStrings,
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
    transition: PropTypes.func,
  };

  static defaultProps = {
    transitionDelay: 0,
    transitionDuration: 0,
    transitionEase: d3.easePolyInOut,
  };

  componentDidMount () {
    this.renderArea();
  }

  componentDidUpdate () {
    this.renderArea();
  }

  getFillColor = (d, i) => {
    if (this.props.colorPalette) {
      if (_.isFunction(this.props.colorPalette)) {
        return this.props.colorPalette(i);
      }
      return this.props.colorPalette[i];
    }
    return null;
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
        ref={ n => this.node = d3.select(n) }
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

    const paths = this.node.selectAll('.area-chart__area')
      .data(this.props.chartData, this.getUniqueDataKey);

    paths
      .exit()
      .interrupt()
      .transition(this.getTransition())
      .attr('d', enterAreaGenerator)
      .remove();

    paths
      .enter()
      .append('path')
      .attr('class', 'area-chart__area')
      .attr('d', enterAreaGenerator)
    .merge(paths)
      .style('fill', this.getFillColor)
      .style('fill', this.getFillColor)
      .style('filter', this.getPathFilter)
      .attr('mask', this.getPathMask)
      .transition(this.getTransition())
      .attr('d', areaGenerator);
  }
}
