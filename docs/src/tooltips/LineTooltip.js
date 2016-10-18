import React from 'react';
import _ from 'lodash';
import numeral from 'numeral';

export default function LineTooltip (props) {
  const name = _.get(props, 'data.original.date') || 'no date';
  function renderValue (title, i) {
    const number = _.get(props, `data.original.${props.valueKeys[i]}`) || 0;
    return (
      <div key={ title } className="line-tooltip__mentions">
        { numeral(number).format('0,0') } { title }
      </div>
    );
  }
  return (
    <div className="line-tooltip">
      <div className="line-tooltip__name">{ name }</div>
      { (props.titleKeys || []).map(renderValue) }
    </div>
  );
}

LineTooltip.propTypes = {
  titleKeys: React.PropTypes.array,
  valueKeys: React.PropTypes.array,
};
