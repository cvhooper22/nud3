import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import moment from 'moment';
import padDataBetweenDates from '../helpers/padDataBetweenDates';
import { updateYScaleDomain } from '../helpers/scaleHelpers';

export default class PadDataBetweenDates extends Component {
  static propTypes = {
    chartData: PropTypes.array,
    children: PropTypes.node,
    className: PropTypes.string,
    classNamePrefix: PropTypes.string,
    dateInterval: PropTypes.string,
    domain: PropTypes.bool,
    endDate: PropTypes.instanceOf(Date),
    startDate: PropTypes.instanceOf(Date),
    xScale: PropTypes.func,
    xScaleDomain: PropTypes.any,
    yScale: PropTypes.func,
    yScaleDomain: PropTypes.any,
    padWith: PropTypes.any,
    normalize: PropTypes.bool,
    DEBUG: PropTypes.bool,
  };

  static defaultProps = {
    dateInterval: 'day',
    normalize: true,
  };

  setupData () {
    const startMoment = moment(this.props.startDate);
    const endMoment = moment(this.props.endDate);
    if (this.props.DEBUG) {
      /* eslint-disable no-console */
      console.debug(`PadDataBetweenDates performing pad between
                    ${this.props.startDate} and ${this.props.endDate}
                    with the pad interval of ${this.props.dateInterval},
                    with normalizing to start of ${this.props.dateInterval} ${this.props.normalize ? 'enabled' : 'disabled'}.`);
    }
    if (this.props.startDate && this.props.endDate && startMoment.isBefore(endMoment)) {
      this.chartData = this.props.chartData.map((datum) => {
        const first = _.first(datum) || {};
        return padDataBetweenDates(datum,
                                   this.props.startDate,
                                   this.props.endDate,
                                   this.props,
                                   this.props.padWith || {
                                     ...first,
                                     yValue: undefined,
                                     xValue: undefined,
                                   },
                                  );
      });
    } else {
      console.warn(`PadDataBetweenDates received invalid startDate or endDate prop
startDate: ${this.props.startDate}
endDate: ${this.props.endDate}
`);
      this.chartData = [];
    }
    this.xScale = this.props.xScale.copy();
    this.updateXScaleDomain();
    this.yScale = this.props.yScale.copy();
    updateYScaleDomain(this.yScale, this.props, this.chartData);
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

  renderChild = (child, i = 0) => {
    if (typeof child.type === 'string') {
      return child;
    }
    return React.cloneElement(child, {
      ...this.props,
      ...child.props,
      children: child.props.children,
      xScale: this.xScale,
      yScale: this.yScale,
      chartData: this.chartData,
      key: i,
    });
  }

  updateXScaleDomain () {
    let domain;
    if (this.props.xScaleDomain) {
      if (_.isFunction(this.props.xScaleDomain)) {
        domain = this.props.xScaleDomain(this.chartData);
      } else {
        domain = this.props.xScaleDomain;
      }
    } else if (this.props.normalize) {
      domain = [
        moment(this.props.startDate).startOf(this.props.dateInterval).toDate(),
        moment(this.props.endDate).startOf(this.props.dateInterval).toDate(),
      ];
    } else {
      domain = [this.props.startDate, this.props.endDate];
    }
    if (domain) {
      this.xScale.domain(domain);
      if (this.props.DEBUG) {
        /* eslint-disable no-console */
        console.debug('PadDataBetweenDates:xScale domain', domain);
        console.debug('PadDataBetweenDates:xScale range', this.xScale.range());
      }
    }
  }

}
