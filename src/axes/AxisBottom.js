import React, { Component, PropTypes } from 'react';
import * as d3 from 'd3';
import shallowCompare from 'react-addons-shallow-compare';
import { stringOrFunc } from '../propTypes/customPropTypes';

export default class AxisBottom extends Component {

  static propTypes = {
    chartData: PropTypes.array,
    className: PropTypes.string,
    classNamePrefix: PropTypes.string,
    xScale: PropTypes.func,
    size: PropTypes.number,
    height: PropTypes.number,
    paddingLeft: PropTypes.number,
    paddingBottom: PropTypes.number,
    paddingRight: PropTypes.number,
    paddingTop: PropTypes.number,
    textTransform: stringOrFunc,
    textDy: stringOrFunc,
    textDx: stringOrFunc,
    tickFormat: stringOrFunc,
    DEBUG: PropTypes.bool,
  };

  static defaultProps = {
    size: 20,
  };

  componentDidMount () {
    this.renderAxis();
  }

  shouldComponentUpdate (...args) {
    return shallowCompare(this, ...args);
  }

  componentDidUpdate () {
    this.renderAxis();
  }

  render () {
    const className = [
      'axis-bottom',
    ];
    if (this.props.classNamePrefix) {
      className.push(`${this.props.classNamePrefix}__axis-bottom`);
    }
    if (this.props.className) {
      className.push(this.props.className);
    }
    return (
      <g
        className={ className.join(' ') }
        transform={ `translate(${this.props.paddingLeft},${this.props.height - this.props.paddingBottom})` }
        ref={ node => this.node = node }
      />
    );
  }

  renderAxis () {
    if (this.props.DEBUG) {
      /* eslint-disable no-console */
      console.log('AxisBottom::renderAxis', this.props);
    }
    this.group = d3.select(this.node);
    if (!this.props.chartData) {
      this.group.selectAll('.tick').remove();
      return;
    }
    const axis = d3.axisBottom(this.props.xScale);
    if (this.props.tickFormat) {
      axis.tickFormat(this.props.tickFormat);
    }
    if (this.props.chartData.length && this.node) {
      this.group.call(axis);
      const texts = this.group.selectAll('text');
      if (this.props.textTransform) {
        texts.attr('transform', this.props.textTransform);
      }
      if (this.props.textDy) {
        texts.attr('dy', this.props.textDy);
      }
      if (this.props.textDx) {
        texts.attr('dx', this.props.textDx);
      }
    }
  }
}
