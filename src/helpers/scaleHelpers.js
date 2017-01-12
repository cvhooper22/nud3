import _ from 'lodash';
import * as d3 from 'd3';

function updateYScaleDomain (yScale, props, data) {
  if (props.yScaleDomain) {
    if (_.isFunction(props.yScaleDomain)) {
      yScale.domain(props.yScaleDomain(data));
    } else {
      yScale.domain(props.yScaleDomain);
    }
  } else {
    const allExtents = _.flatten(data.map(datum => d3.extent(datum, d => d.yValue || 0)));
    const valueExtent = d3.extent(allExtents);
    if (props.yScaleMinimum !== undefined) {
      valueExtent[0] = props.yScaleMinimum;
    }
    if (props.yScaleMaximum !== undefined) {
      valueExtent[1] = props.yScaleMaximum;
    }
    yScale.domain(valueExtent);
    if (props.DEBUG) {
      /* eslint-disable no-console */
      console.debug('yScale domain', valueExtent);
    }
  }
}

function updateXScaleDomain (xScale, props, data) {
  let domain;
  if (props.xScaleDomain) {
    if (_.isFunction(props.xScaleDomain)) {
      domain = props.xScaleDomain(data);
    } else {
      domain = props.xScaleDomain;
    }
  } else {
    const first = _.first(props.data);
    const last = _.last(props.data);
    if (first && last) {
      domain = [first[props.xKey], last[props.xKey]];
    }
  }
  if (domain) {
    xScale.domain(domain);
    if (props.DEBUG) {
      /* eslint-disable no-console */
      console.debug('xScale domain', domain);
    }
  }
}

export {
  updateXScaleDomain,
  updateYScaleDomain,
};
