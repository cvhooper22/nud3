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
  };

  static defaultProps = {
    transitionDelay: 0,
    transitionDuration: 0,
    transitionEase: d3.easePolyInOut,
    dotRadius: 5,
  };

  constructor (props, ...args) {
    super(props, ...args);
    this.getUniqueDataKey = ::this.getUniqueDataKey;
    this.getFillColor = ::this.getFillColor;
    this.getPathFilter = ::this.getPathFilter;
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
    this.group.selectAll('.scatterplot__dots')
      .data(this.props.chartData, this.getUniqueDataKey)
      .enter()
      .append('g')
      .attr('class', 'scatterplot__dots');
  }

  renderDots () {
    const bottomY = this.props.yScale(this.props.yScale.domain()[0]);
    const dots = this.group.selectAll('.scatterplot__dots');
    dots
      .selectAll('.scatterplot__dots__dot')
      .data(d => d)
      .enter()
      .append('circle')
      .attr('cy', bottomY)
      .attr('cx', d => this.props.xScale(d.xValue))
      .attr('r', 1)
      .attr('class', 'scatterplot__dots__dot');

    // update
    const ease = _.isFunction(this.props.transitionEase) ? this.props.transitionEase : d3[this.props.transitionEase];
    const dot = dots.selectAll('.scatterplot__dots__dot');
    const dotTransition = dot
      .transition()
      .duration(this.props.transitionDuration)
      .delay(this.props.transitionDelay)
      .ease(ease)
      .attr('r', this.props.dotRadius)
      .attr('cy', d => this.props.yScale(d.yValue || 0))
      .attr('cx', d => this.props.xScale(d.xValue));
    if (this.props.filter) {
      dotTransition.style('filter', this.getPathFilter);
    } else {
      dotTransition.style('filter', null);
    }
    if (this.hasTooltip()) {
      dot.on('mouseover.Scatterplot', this.tooltipRenderer.onShow);
      dot.on('mouseout.Scatterplot', this.tooltipRenderer.onHide);
    } else {
      dot.off('mouseover.Scatterplot');
      dot.off('mouseout.Scatterplot');
    }
    if (this.props.colorPalette) {
      dot.style('fill', this.getFillColor);
    } else {
      dot.style('fill', null);
    }
  }

  hasTooltip () {
    return React.Children.count(this.props.children) === 1;
  }
}
