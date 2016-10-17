import React from 'react';
import _ from 'lodash';
import numeral from 'numeral';

export default function LineTooltip (props) {
  const name = _.get(props, 'data.original.date') || 'no date';
  const number = _.get(props, 'data.original.mentions_total') || 0;
  return (
    <div className="line-tooltip">
      <div className="line-tooltip__name">{ name }</div>
      <div className="line-tooltip__mentions">{ numeral(number).format('0,0') } Mentions</div>
    </div>
  );
};
