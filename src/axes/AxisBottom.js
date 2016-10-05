import React, { Component, PropTypes } from 'react';
import * as d3 from 'd3';
import stringOrFunc from '../propTypes/stringOrFunc';

export default class AxisBottom extends Component {

  static propTypes = {
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
    this.xAxis = d3.axisBottom(this.props.xScale);
    this.group = d3.select(this.node);
    this.group.call(this.xAxis);
    const texts = this.group
      .selectAll('text');
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
