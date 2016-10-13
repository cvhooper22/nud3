import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import _ from 'lodash';
import curryThisElement from '../helpers/curryThisElement';

export default class HorizontalHoverBar extends Component {

  static tooltipLeft = Symbol.for('left');
  static tooltipCenter = Symbol.for('center');
  static tooltipRight = Symbol.for('right');

  static propTypes = {
    className: PropTypes.string,
    chartData: PropTypes.array,
    classNamePrefix: PropTypes.string,
    paddingTop: PropTypes.number,
    paddingLeft: PropTypes.number,
    xScale: PropTypes.func,
    yScale: PropTypes.func,
    areaWidth: PropTypes.number,
    areaHeight: PropTypes.number,
    barHeight: PropTypes.number,
    filter: PropTypes.string,
    tooltip: PropTypes.any,
    tooltipLocation: PropTypes.symbol,
    tooltipClassName: PropTypes.string,
  };

  static defaultProps = {
    barHeight: 2,
    tooltipClassName: 'tooltip',
    tooltipLocation: Symbol.for('left'),
  };

  constructor (...args) {
    super(...args);
    this.state = {};
    this.onMouseOver = curryThisElement(this.onMouseOver, this);
    this.onMouseMove = curryThisElement(this.onMouseMove, this);
    this.onMouseOut = curryThisElement(this.onMouseOut, this);
  }

  componentDidMount () {
    this.setupEvents();
    this.cacheData();
  }

  componentDidUpdate () {
    this.cacheData();
    this.renderTooltip();
  }

  componentWillUnmount () {
    this.hideTooltip();
    const ownerSVGElement = d3.select(this.bar.node().ownerSVGElement);
    ownerSVGElement.on('mouseover.HorizontalHoverBar', null);
    ownerSVGElement.on('mousemove.HorizontalHoverBar', null);
    ownerSVGElement.on('mouseout.HorizontalHoverBar', null);
  }

  onMouseOver (element) {
    this.updateHighlightBar(element);
  }

  onMouseMove (element) {
    this.updateHighlightBar(element);
  }

  onMouseOut () {
    this.hideHighlightBar();
    this.hideTooltip();
  }

  getTooltipContainer () {
    if (!this.tooltipContainer) {
      this.tooltipContainer = window.document.createElement('div');
      this.tooltipContainer.className = this.props.tooltipClassName;
    }
    return this.tooltipContainer;
  }

  getLocationOffset (bar, tooltip) {
    const barRect = bar.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const offset = {
      top: barRect.top + window.scrollY,
    };
    if (this.props.tooltipLocation === HorizontalHoverBar.tooltipLeft) {
      offset.left = barRect.left + window.scrollX;
    } else if (this.props.tooltipLocation === HorizontalHoverBar.tooltipRight) {
      offset.left = (barRect.left + window.scrollX + this.props.areaWidth) - tooltipRect.width;
    } else {
      offset.left = (barRect.left + window.scrollX + (this.props.areaWidth / 2)) - (tooltipRect.width / 2);
    }
    return offset;
  }

  setupEvents () {
    const ownerSVGElement = d3.select(this.bar.node().ownerSVGElement);
    ownerSVGElement.on('mouseover.HorizontalHoverBar', this.onMouseOver);
    ownerSVGElement.on('mousemove.HorizontalHoverBar', this.onMouseMove);
    ownerSVGElement.on('mouseout.HorizontalHoverBar', this.onMouseOut);
  }

  render () {
    const className = [
      'horizontal-hover-bar',
    ];
    if (this.props.classNamePrefix) {
      className.push(`${this.props.classNamePrefix}__horizontal-hover-bar`);
    }
    if (this.props.className) {
      className.push(this.props.className);
    }
    let transform;
    if (this.state.yTranslate !== undefined) {
      transform = `translate(0,${this.state.yTranslate})`;
    }
    return (
      <g
        className={ className.join(' ') }
        transform={ `translate(${this.props.paddingLeft},${this.props.paddingTop})` }
      >
        <rect
          height={ this.props.barHeight }
          width={ this.props.areaWidth }
          className="horizontal-hover-bar__bar"
          style={{
            pointerEvents: 'none',
            display: this.state.yTranslate ? '' : 'none',
          }}
          filter={ this.props.filter }
          transform={ transform }
          ref={ n => this.bar = d3.select(n) }
        />
      </g>
    );
  }

  renderTooltip () {
    if (this.state.data && this.props.tooltip) {
      const container = this.getTooltipContainer();
      if (!container.parentNode) {
        window.document.body.appendChild(container);
      }
      const TooltipComponent = this.props.tooltip;
      ReactDOM.render((
        <TooltipComponent data={ this.state.data } />
      ), container);

      const style = this.getLocationOffset(this.bar.node(), container);
      container.style.left = `${style.left}px`;
      container.style.top = `${style.top}px`;
    } else {
      this.hideTooltip();
    }
  }

  hideTooltip () {
    if (this.tooltipContainer && this.tooltipContainer.parentNode) {
      this.tooltipContainer.parentNode.removeChild(this.tooltipContainer);
      delete this.tooltipContainer;
    }
  }

  updateHighlightBar (mouseEvent) {
    const mouse = d3.mouse(mouseEvent);
    mouse[0] -= this.props.paddingLeft;
    mouse[1] -= this.props.paddingTop;
    const y0 = this.props.yScale.invert(mouse[1]);
    const bisected = d3.bisectLeft(this.flattenedYValues, y0);
    const leftData = this.flattenedChartData[bisected - 1];
    const rightData = this.flattenedChartData[bisected];
    let data = leftData || rightData;
    if (leftData && rightData) {
      data = y0 - leftData.yValue > rightData.yValue - y0 ? rightData : leftData;
    }
    if (data) {
      const yTranslate = this.props.yScale(data.yValue || 0) - (this.props.barHeight / 2);
      this.setState({
        yTranslate,
        data,
      });
    } else {
      this.hideHighlightBar();
    }
  }

  hideHighlightBar () {
    this.setState({
      yTranslate: undefined,
      data: undefined,
    });
  }

  cacheData () {
    this.flattenedChartData = _.flatten(this.props.chartData).filter(a => a.yValue !== undefined);
    this.flattenedChartData.sort((a, b) => a.yValue - b.yValue);
    this.flattenedYValues = (this.flattenedChartData || []).map(d => d.yValue);
  }
}
