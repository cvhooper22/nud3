import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import padDataBetweenDates from '../helpers/padDataBetweenDates';

export default class PadDataBetweenDates extends Component {
  static propTypes = {
    chartData: PropTypes.array,
    children: PropTypes.node,
    className: PropTypes.string,
    classNamePrefix: PropTypes.string,
    dateInterval: PropTypes.string,
    endDate: PropTypes.instanceOf(Date),
    startDate: PropTypes.instanceOf(Date),
    xScale: PropTypes.func,
  };

  static defaultProps = {
    dateInterval: 'day',
  };

  constructor (...args) {
    super(...args);
    this.renderChild = ::this.renderChild;
  }

  setupData () {
    const startMoment = moment(this.props.startDate);
    const endMoment = moment(this.props.endDate);
    if (!startMoment.isBefore(endMoment)) {
      return;
    }
    this.chartData = this.props.chartData.map((datum) => {
      return padDataBetweenDates(datum,
                                 this.props.startDate,
                                 this.props.endDate,
                                 this.props.dateInterval);
    });
    this.xScale = this.props.xScale.copy();
    this.xScale.domain([this.props.startDate, this.props.endDate]);
  }

  render () {
    this.setupData();
    const name = 'pad-data-between-dates';
    const className = [name];
    if (this.props.classNamePrefix) {
      className.push(`${this.props.classNamePrefix}__${name}`);
    }
    if (this.props.className) {
      className.push(this.props.className);
    }
    return (
      <g className={ className.join(' ') }>
        { React.Children.map(this.props.children, this.renderChild) }
      </g>
    );
  }

  renderChild (child, i = 0) {
    return React.cloneElement(child, {
      ...this.props,
      ...child.props,
      xScale: this.xScale,
      chartData: this.chartData,
      key: i,
    });
  }
}
