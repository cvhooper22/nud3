import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import _ from 'lodash';
import curryThisElement from '../helpers/curryThisElement';
import tooltipPositioner from '../helpers/tooltipPositioner';

export default class VerticalHoverBar extends Component {

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
    location: PropTypes.symbol,
    children: PropTypes.node,
    tooltipClassName: PropTypes.string,
  };

  static defaultProps = {
    barWidth: 2,
    tooltipClassName: 'tooltip',
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
    ownerSVGElement.off('mouseover.VerticalHoverBar', null);
    ownerSVGElement.off('mousemove.VerticalHoverBar', null);
    ownerSVGElement.off('mouseout.VerticalHoverBar', null);
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

  renderTooltip () {
    if (this.state.data && React.Children.count(this.props.children)) {
      const child = React.Children.only(this.props.children);
      const container = this.getTooltipContainer();
      if (!container.parentNode) {
        window.document.body.appendChild(container);
      }
      ReactDOM.render((
        React.cloneElement(child, {
          ...this.props,
          ...child.props,
          children: child.props.children,
          data: this.state.data,
        })
      ), container);
      tooltipPositioner(child.props.position, this.bar.node(), container, child.props);
    } else {
      this.hideTooltip();
    }
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
