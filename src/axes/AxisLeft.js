import React, { Component, PropTypes } from 'react';
import * as d3 from 'd3';

export default class AxisLeft extends Component {

  static propTypes = {
    className: PropTypes.string,
    classNamePrefix: PropTypes.string,
    yScale: PropTypes.func,
    size: PropTypes.number,
    height: PropTypes.number,
    paddingLeft: PropTypes.number,
    paddingBottom: PropTypes.number,
    paddingRight: PropTypes.number,
    paddingTop: PropTypes.number,
  };

  static defaultProps = {
    size: 20,
  };

  componentDidMount () {
    this.renderAxis();
  }

  componentDidUpdate () {
    this.renderAxis();
  }

  render () {
    const className = [
      'axis-left',
    ];
    if (this.props.classNamePrefix) {
      className.push(`${this.props.classNamePrefix}__axis-left`);
    }
    if (this.props.className) {
      className.push(this.props.className);
    }
    return (
      <g className={ className.join(' ') }ref={ n => this.node = n } />
    );
  }

  renderAxis () {
    this.xAxis = d3.axisLeft(this.props.yScale);
    this.group = d3.select(this.node);
    this.group.call(this.xAxis);
    const yAxisOffset = this.props.paddingLeft;
    this.group.attr('transform', `translate(${yAxisOffset},${this.props.paddingTop})`);
  }
}
