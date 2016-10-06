import React, { Component, PropTypes } from 'react';
import * as d3 from 'd3';
import _ from 'lodash';

const stringOrArrayOfStrings = PropTypes.oneOfType([
  PropTypes.string,
  React.PropTypes.arrayOf(PropTypes.string),
]);

export default class PieChart extends Component {

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
    areaHeight: PropTypes.number,
    areaWidth: PropTypes.number,
    labelFormat: PropTypes.func,
    labelDy: PropTypes.string,
    labelDx: PropTypes.string,
    padAngle: PropTypes.number,

  };

  static defaultProps = {
    padAngle: 0.01,
  };

  constructor (...args) {
    super(...args);
    this.getUniqueDataKey = ::this.getUniqueDataKey;
    this.getFillColor = ::this.getFillColor;
    this.getPathFilter = ::this.getPathFilter;
    this.getSliceText = ::this.getSliceText;
  }

  componentDidMount () {
    this.renderPies();
  }

  componentDidUpdate () {
    this.renderPies();
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

  getSliceText (d, ...args) {
    return this.props.labelFormat(d.data.yValue, d, ...args);
  }

  render () {
    const className = [
      'pie-chart',
    ];
    if (this.props.classNamePrefix) {
      className.push(`${this.props.classNamePrefix}__pie-chart`);
    }
    if (this.props.className) {
      className.push(this.props.className);
    }
    return (
      <g
        className={ className.join(' ') }
        ref={ n => this.node = n }
        transform={ `translate(${this.props.paddingLeft + (this.props.areaWidth / 2)},${this.props.paddingTop + (this.props.areaHeight / 2)})` }
        clipPath={ this.props.clipPath }
      />
    );
  }

  renderPies () {
    this.group = d3.select(this.node);
    const pies = this.group.selectAll('.pie-chart__pie')
      .data(this.props.chartData, this.getUniqueDataKey)
      .enter()
      .append('g');
    pies
      .attr('class', 'pie-chart__pie');
    this.renderPie();
  }

  renderPie () {
    const pieArc = d3.pie()
      .value(d => d.yValue || 0);
    const arc = d3.arc()
      .outerRadius(Math.min(this.props.areaHeight, this.props.areaWidth) / 2)
      .innerRadius(Math.min(this.props.areaHeight, this.props.areaWidth) / 4)
      .padAngle(this.props.padAngle);
    this.renderArcs(pieArc, arc);
    if (this.props.labelFormat) {
      this.renderArcLabels(pieArc, arc);
    }
  }

  renderArcs (pieArc, arc) {
    const pies = this.group.selectAll('.pie-chart__pie');
    let slices = pies.selectAll('.pie-chart__pie__slice')
      .data(pieArc)
      .enter()
      .append('path')
      .attr('class', 'pie-chart__pie__slice');
    if (this.props.filter) {
      slices.style('filter', this.getPathFilter);
    }


    slices = pies
      .selectAll('.pie-chart__pie__slice')
      .attr('d', arc);
    if (this.props.colorPalette) {
      slices.style('fill', this.getFillColor);
    }
  }

  renderArcLabels (pieArc, arc) {
    const pies = this.group.selectAll('.pie-chart__pie');
    pies.selectAll('.pie-chart__pie__slice__labels')
      .data(pieArc)
      .enter()
      .append('text')
      .attr('class', 'pie-chart__pie__slice__labels');

    const texts = pies
      .selectAll('.pie-chart__pie__slice__labels')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .text(this.getSliceText);
    if (this.props.labelDx) {
      texts.attr('dx', this.props.labelDx);
    }
    if (this.props.labelDy) {
      texts.attr('dy', this.props.labelDy);
    }
  }
}
