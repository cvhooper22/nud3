import React, { PropTypes } from 'react';
import * as d3 from 'd3';

const createGradientFilter = (color, filterName) => {
  return (
    <linearGradient key={ filterName } id={ filterName } x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stopColor="transparent" />
      <stop offset="100%" stopColor={ color } />
    </linearGradient>
  );
};
const GradientFilters = (props) => {
  const renderValueKey = (valueKey, i) => {
    const color = d3.color(props.colorPalette(i));
    color.opacity = props.opacity;
    return createGradientFilter(color.toString(), `${props.idPrefix || ''}${valueKey}`);
  };
  return (
    <defs className="gradient-filters">
      { props.valueKeys.map(renderValueKey) }
    </defs>
  );
};
GradientFilters.propTypes = {
  colorPalette: PropTypes.func,
  valueKeys: PropTypes.array,
  idPrefix: PropTypes.string,
  opacity: PropTypes.number,
};
GradientFilters.defaultProps = {
  opacity: 0.5,
};
export default GradientFilters;
