import React, { Component, PropTypes } from 'react';
import * as d3 from 'd3';
import { arrayOrFunc } from '../propTypes/customPropTypes';

export default class VerticalGrid extends Component {

  static propTypes = {
    className: PropTypes.string,
    classNamePrefix: PropTypes.string,
    yScale: PropTypes.func,
    xScale: PropTypes.func,
    areaHeight: PropTypes.number,
    height: PropTypes.number,
    areaWidth: PropTypes.number,
    paddingLeft: PropTypes.number,
    paddingBottom: PropTypes.number,
    paddingRight: PropTypes.number,
    paddingTop: PropTypes.number,
    ticks: arrayOrFunc,
  };

  componentDidMount () {
    this.renderGrid();
  }

  componentDidUpdate () {
    this.renderGrid();
  }

  getClassNames () {
    const className = [
      'vertical-grid',
    ];
    if (this.props.classNamePrefix) {
      className.push(`${this.props.classNamePrefix}__vertical-grid`);
    }
    if (this.props.className) {
      className.push(this.props.className);
    }
    return className.join(' ');
  }

  render () {
    return (
      <g
        className={ this.getClassNames() }
        ref={ n => this.node = d3.select(n) }
        transform={ `translate(${this.props.paddingLeft}, ${this.props.height - this.props.paddingBottom})` }
      />
    );
  }

  renderGrid () {
    const grid = d3.axisBottom(this.props.xScale)
                   .tickSize(-this.props.areaHeight)
                   .tickFormat('');

    if (this.props.ticks) {
      grid.ticks(this.props.ticks);
    }

    this.node.call(grid);
  }
}
