import React, { Component, PropTypes } from 'react';
import * as d3 from 'd3';
import _ from 'lodash';
import curryThisElement from '../helpers/curryThisElement';
import { stringOrArrayOfStrings, stringOrFunc } from '../propTypes/customPropTypes';
import TooltipRenderer from '../helpers/TooltipRenderer';

export default class Scatterplot extends Component {

  static propTypes = {
    chartData: PropTypes.array,
    className: PropTypes.string,
    classNamePrefix: PropTypes.string,
    colorPalette: PropTypes.any,
    filter: stringOrArrayOfStrings,
    paddingLeft: PropTypes.number,
    paddingTop: PropTypes.number,
    valueKeys: PropTypes.array,
    xScale: PropTypes.func,
    yScale: PropTypes.func,
    clipPath: PropTypes.string,
    transitionDuration: PropTypes.number,
    transitionDelay: PropTypes.number,
    transitionEase: stringOrFunc,
    dotRadius: PropTypes.any,
    children: PropTypes.node,
    transition: PropTypes.func,
  };

  static defaultProps = {
    transitionDelay: 0,
    transitionDuration: 0,
    transitionEase: d3.easePolyInOut,
    dotRadius: 5,
  };

  constructor (props, ...args) {
    super(props, ...args);
    this.onMouseOver = curryThisElement(this.onMouseOver, this);
    this.onMouseOut = curryThisElement(this.onMouseOut, this);
  }

  componentDidMount () {
    this.tooltipRenderer = new TooltipRenderer(this);
    this.group.call(this.tooltipRenderer.bind);
    if (this.hasTooltip()) {
      this.tooltipRenderer.update(React.Children.only(this.props.children));
    }
    this.renderChart();
  }

  componentDidUpdate () {
    this.renderChart();
    if (this.hasTooltip()) {
      this.tooltipRenderer.update(React.Children.only(this.props.children));
    }
  }

  getFillColor = (d, i) => {
    if (this.props.colorPalette) {
      if (_.isFunction(this.props.colorPalette)) {
        return this.props.colorPalette(i);
      } else if (_.isArray(this.props.colorPalette)) {
        return this.props.colorPalette[i];
      }
      return this.props.colorPalette;
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
      'scatterplot',
    ];
    if (this.props.classNamePrefix) {
      className.push(`${this.props.classNamePrefix}__scatterplot`);
    }
    if (this.props.className) {
      className.push(this.props.className);
    }
    return (
      <g
        className={ className.join(' ') }
        transform={ `translate(${this.props.paddingLeft},${this.props.paddingTop})` }
        clipPath={ this.props.clipPath }
        ref={ n => this.group = d3.select(n) }
      />
    );
  }

  renderChart () {
    this.renderDotsContainer();
    this.renderDots();
  }

  renderDotsContainer () {
    const dots = this.group.selectAll('.scatterplot__dots')
      .data(this.props.chartData, this.getUniqueDataKey);

    dots
      .exit()
      .transition(this.getTransition())
      .style('opacity', 0)
      .remove();
    dots
      .enter()
      .append('g')
      .attr('class', 'scatterplot__dots')
      .merge(dots)
      .style('fill', this.getFillColor);
  }

  renderDots () {
    const bottomY = this.props.yScale(this.props.yScale.domain()[0]);
    const dots = this.group.selectAll('.scatterplot__dots');
    const dot = dots
      .selectAll('.scatterplot__dots__dot')
      .data(d => d);

    dot
      .enter()
      .append('circle')
      .attr('class', 'scatterplot__dots__dot')
      .attr('cy', bottomY)
      .attr('cx', d => this.props.xScale(d.xValue))
    .merge(dot)
      .style('filter', this.getPathFilter)
      .transition(this.getTransition())
      .attr('r', this.props.dotRadius)
      .attr('cy', d => this.props.yScale(d.yValue || 0))
      .attr('cx', d => this.props.xScale(d.xValue));

    if (this.hasTooltip()) {
      dot.on('mouseover.Scatterplot', this.tooltipRenderer.onShow);
      dot.on('mouseout.Scatterplot', this.tooltipRenderer.onHide);
    } else {
      dot.on('mouseover.Scatterplot', null);
      dot.on('mouseout.Scatterplot', null);
    }
  }

  hasTooltip () {
    return React.Children.count(this.props.children) === 1;
  }
}
