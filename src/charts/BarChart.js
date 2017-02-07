import React, { Component, PropTypes } from 'react';
import * as d3 from 'd3';
import _ from 'lodash';
import { stringOrArrayOfStrings, stringOrFunc } from '../propTypes/customPropTypes';
import TooltipRenderer from '../helpers/TooltipRenderer';

export default class BarChart extends Component {

  static propTypes = {
    areaHeight: PropTypes.number,
    areaWidth: PropTypes.number,
    chartData: PropTypes.array,
    children: PropTypes.node,
    className: PropTypes.string,
    classNamePrefix: PropTypes.string,
    clipPath: PropTypes.string,
    colorPalette: PropTypes.any,
    fill: PropTypes.bool,
    filter: stringOrArrayOfStrings,
    groupPadding: PropTypes.any,
    mask: stringOrArrayOfStrings,
    paddingBottom: PropTypes.number,
    paddingLeft: PropTypes.number,
    paddingRight: PropTypes.number,
    paddingTop: PropTypes.number,
    transition: PropTypes.func,
    transitionDelay: PropTypes.number,
    transitionDuration: PropTypes.number,
    transitionEase: stringOrFunc,
    valueKeys: PropTypes.array,
    xScale: PropTypes.func,
    yScale: PropTypes.func,
    onTooltipShow: PropTypes.func,
    onTooltipHide: PropTypes.func,
    displayItem: PropTypes.object,
    displayItemFilter: PropTypes.func,
  };

  static defaultProps = {
    fill: true,
    transitionDelay: 0,
    transitionDuration: 0,
    transitionEase: d3.easePolyInOut,
    groupPadding: 0.1,
  };

  componentDidMount () {
    this.tooltipRenderer = new TooltipRenderer(this);
    this.node.call(this.tooltipRenderer.bind);
    if (this.hasTooltip()) {
      this.tooltipRenderer.update(React.Children.only(this.props.children));
    }
    this.renderChart();
  }

  componentDidUpdate () {
    this.renderChart();
    if (this.hasTooltip()) {
      this.tooltipRenderer.update(React.Children.only(this.props.children));

      if (this.props.displayItem) {
        this.showTooltipForItem(this.props.displayItem);
      } else {
        this.hideTooltips();
      }
    }
  }

  onTooltipShow = (elementData) => {
    if (this.props.onTooltipShow) {
      this.props.onTooltipShow(elementData.original);
    }
  }

  onTooltipHide = (elementData) => {
    if (this.props.onTooltipHide) {
      this.props.onTooltipHide(elementData.original);
    }
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
    if (!this.props.xScale.bandwidth) {
      /* eslint-disable no-console */
      console.warn('BarChart\'s xScale needs to provide the bandwidth function. See d3.scaleBand');
      return;
    }

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
    this.renderTooltips();
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

  renderTooltips () {
    const bars = this.node
      .selectAll('.bar-chart__group')
      .selectAll('.bar-chart__group__bar');
    if (this.hasTooltip()) {
      bars.on('mouseover.BarChart', this.tooltipRenderer.onShow);
      bars.on('mouseout.BarChart', this.tooltipRenderer.onHide);
      bars.on('mouseover.BarChartTooltip', this.onTooltipShow);
      bars.on('mouseout.BarChartTooltip', this.onTooltipHide);
      this.node.on('mousemove.BarChart', this.tooltipRenderer.onMove);
    } else {
      bars.on('mouseover.BarChart', null);
      bars.on('mouseout.BarChart', null);
      bars.on('mouseover.BarChartTooltip', null);
      bars.on('mouseout.BarChartTooltip', null);
      this.node.on('mousemove.BarChart', null);
    }
  }

  hasTooltip () {
    return React.Children.count(this.props.children) === 1;
  }

  showTooltipForItem () {
    if (this.props.displayItemFilter) {
      const feature = this.node
        .selectAll('.bar-chart__group')
        .selectAll('.bar-chart__group__bar')
        .filter(this.props.displayItemFilter);
      feature.each(this.tooltipRenderer.onShow);
    }
  }

  hideTooltips () {
    this.node
      .selectAll('.bar-chart__group')
      .selectAll('.bar-chart__group__bar')
      .each(this.tooltipRenderer.onHide);
  }

}
