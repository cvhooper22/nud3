import React, { PropTypes } from 'react';
import _ from 'lodash';
import numeral from 'numeral';

export default function MapTooltip (props) {
  const name = _.get(props, 'data.properties.name') || 'no state';
  const number = _.get(props, 'data.data.yValue') || 0;
  return (
    <div className="map-tooltip">
      <div className="map-tooltip__name">{ name }</div>
      <div className="map-tooltip__mentions">{ numeral(number).format('0,0') } Mentions</div>
    </div>
  );
}
MapTooltip.propTypes = {
  data: PropTypes.any,
};
