import React, { Component, PropTypes } from 'react';
import * as d3 from 'd3';
import _ from 'lodash';
import {
  stringOrArrayOfStrings,
  numberOrFunc,
  arrayOrFunc,
  stringOrFunc,
} from '../propTypes/customPropTypes';

export default class BubbleChart extends Component {

  static propTypes = {
    chartData: PropTypes.array,
    className: PropTypes.string,
    classNamePrefix: PropTypes.string,
    colorPalette: arrayOrFunc,
    fillColor: arrayOrFunc,
    filter: stringOrArrayOfStrings,
    paddingBottom: PropTypes.number,
    paddingLeft: PropTypes.number,
    paddingRight: PropTypes.number,
    paddingTop: PropTypes.number,
    valueKeys: PropTypes.array,
    xScale: PropTypes.func,
    yScale: PropTypes.func,
    clipPath: PropTypes.string,
    packPadding: numberOrFunc,
    areaHeight: PropTypes.number,
    areaWidth: PropTypes.number,
    labelFormat: PropTypes.func,
    labelDy: stringOrFunc,
    labelDx: stringOrFunc,
  };

  static defaultProps = {
    packPadding: 1.5,
  };

  constructor (...args) {
    super(...args);
    this.getColorPaletteFill = ::this.getColorPaletteFill;
    this.getPathFilter = ::this.getPathFilter;
  }

  componentDidMount () {
    this.renderBubbles();
  }

  componentDidUpdate () {
    this.renderBubbles();
  }

  getColorPaletteFill (d, i) {
    if (this.props.colorPalette) {
      if (_.isFunction(this.props.colorPalette)) {
        return this.props.colorPalette(d, i);
      } else {
        return this.props.colorPalette[i];
      }
    }
    return '';
  }

  getPathFilter (d, i) {
    let filter = this.props.filter;
    if (_.isArray(filter)) {
      filter = filter[i];
    }
    return `url(#${filter})`;
  }

  getCircleId (d, i) {
    return `circle-${d.data.yKey}-${i}`;
  }

  render () {
    const className = [
      'bubble-chart',
    ];
    if (this.props.classNamePrefix) {
      className.push(`${this.props.classNamePrefix}__bubble-chart`);
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

  renderBubbles () {
    const packLayout = d3.pack()
      .size([this.props.areaWidth, this.props.areaHeight])
      .padding(this.props.packPadding);
    const hierarchy = d3.hierarchy(this.transformedBubbleData())
      .sum(d => d.yValue);
    const data = packLayout(hierarchy).children;
    this.group = d3.select(this.node);
    const enterBubbles = this.group.selectAll('.bubble-chart__bubble')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'bubble-chart__bubble');
    const updateBubbles = this.group.selectAll('.bubble-chart__bubble')
      .attr('transform', d => `translate(${d.x},${d.y})`);

    this.renderCircles(enterBubbles, updateBubbles);
    if (this.props.labelFormat) {
      this.renderLabels(enterBubbles, updateBubbles);
    }
  }

  renderCircles (enterBubbles, updateBubbles) {
    enterBubbles
      .append('circle')
      .attr('class', 'bubble-chart__bubble__circle');
    const circles = updateBubbles.select('circle')
      .attr('r', d => d.r)
      .attr('id', this.getCircleId);
    if (this.props.colorPalette) {
      circles.style('fill', this.getColorPaletteFill);
    } else if (this.props.fillColor) {
      circles.style('fill', this.props.fillColor);
    } else {
      circles.style('fill', null);
    }
    if (this.props.filter) {
      circles.attr('filter', this.getPathFilter);
    } else {
      circles.attr('filter', null);
    }
  }

  renderLabels (enterBubbles, updateBubbles) {
    enterBubbles
      .append('text')
      .attr('class', 'bubble-chart__bubble__label');
    const texts = updateBubbles.select('.bubble-chart__bubble__label')
      .text(this.props.labelFormat);
    if (this.props.labelDx) {
      texts.attr('dx', this.props.labelDx);
    } else {
      texts.attr('dx', null);
    }
    if (this.props.labelDy) {
      texts.attr('dy', this.props.labelDy);
    } else {
      texts.attr('dy', null);
    }
  }

  transformedBubbleData () {
    return {
      children: this.props.chartData[0].filter(d => d.yValue),
    };
  }
}
