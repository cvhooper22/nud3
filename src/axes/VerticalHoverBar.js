import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import _ from 'lodash';
import curryThisElement from '../helpers/curryThisElement';

export default class VerticalHoverBar extends Component {

  static tooltipTop = Symbol.for('top');
  static tooltipMiddle = Symbol.for('middle');
  static tooltipBottom = Symbol.for('bottom');

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
    barWidth: PropTypes.number,
    filter: PropTypes.string,
    tooltip: PropTypes.any,
    tooltipLocation: PropTypes.symbol,
    tooltipClassName: PropTypes.string,
  };

  static defaultProps = {
    barWidth: 2,
    tooltipClassName: 'tooltip',
    tooltipLocation: Symbol.for('top'),
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
    ownerSVGElement.on('mouseover.VerticalHoverBar', null);
    ownerSVGElement.on('mousemove.VerticalHoverBar', null);
    ownerSVGElement.on('mouseout.VerticalHoverBar', null);
  }

  onMouseOver (element) {
    this.updateHighlightBar(element);
  }

  onMouseMove (element) {
    this.updateHighlightBar(element);
  }

  onMouseOut (element) {
    this.hideHighlightBar(element);
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
      left: barRect.left + window.scrollX + barRect.width,
    };
    if (this.props.tooltipLocation === VerticalHoverBar.tooltipTop) {
      offset.top = barRect.top + window.scrollY;
    } else if (this.props.tooltipLocation === VerticalHoverBar.tooltipBottom) {
      offset.top = (barRect.top + window.scrollY + barRect.height) - tooltipRect.height;
    } else {
      offset.top = (barRect.top + window.scrollY + (barRect.height / 2)) - (tooltipRect.height / 2);
    }
    return offset;
  }

  setupEvents () {
    const ownerSVGElement = d3.select(this.bar.node().ownerSVGElement);
    ownerSVGElement.on('mouseover.VerticalHoverBar', this.onMouseOver);
    ownerSVGElement.on('mousemove.VerticalHoverBar', this.onMouseMove);
    ownerSVGElement.on('mouseout.VerticalHoverBar', this.onMouseOut);
  }

  render () {
    const className = [
      'vertical-hover-bar',
    ];
    if (this.props.classNamePrefix) {
      className.push(`${this.props.classNamePrefix}__vertical-hover-bar`);
    }
    if (this.props.className) {
      className.push(this.props.className);
    }
    let transform;
    if (this.state.xTranslate !== undefined) {
      transform = `translate(${this.state.xTranslate},0)`;
    }
    return (
      <g
        className={ className.join(' ') }
        transform={ `translate(${this.props.paddingLeft},${this.props.paddingTop})` }
      >
        <rect
          height={ this.props.areaHeight }
          width={ this.props.barWidth }
          className="vertical-hover-bar__bar"
          style={{
            pointerEvents: 'none',
            display: this.state.xTranslate ? '' : 'none',
          }}
          filter={ this.props.filter }
          transform={ transform }
          ref={ n => this.bar = d3.select(n) }
        />
      </g>
    );
  }

  updateHighlightBar (mouseEvent) {
    const mouse = d3.mouse(mouseEvent);
    mouse[0] -= this.props.paddingLeft;
    mouse[1] -= this.props.paddingTop;
    const x0 = this.props.xScale.invert(mouse[0]);
    const bisected = d3.bisectLeft(this.flattenedXValues, x0);
    const leftData = this.flattenedChartData[bisected - 1];
    const rightData = this.flattenedChartData[bisected];
    let data = leftData || rightData;
    if (leftData && rightData) {
      data = x0 - leftData.xValue > rightData.xValue - x0 ? rightData : leftData;
    }
    if (data) {
      const xTranslate = this.props.xScale(data.xValue) - (this.props.barWidth / 2);
      this.setState({
        xTranslate,
        data,
      });
    } else {
      this.hideHighlightBar();
      this.hideTooltip();
    }
  }

  hideHighlightBar () {
    this.setState({
      xTranslate: undefined,
      data: undefined,
    });
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

  cacheData () {
    this.flattenedChartData = _.flatten(this.props.chartData).filter(a => a.xValue !== undefined);
    this.flattenedChartData.sort((a, b) => a.xValue - b.xValue);
    this.flattenedXValues = (this.flattenedChartData || []).map(d => d.xValue);
  }
}
