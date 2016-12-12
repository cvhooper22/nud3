import React, { PropTypes } from 'react';

const numberOrFunc = PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.func,
]);

const stringOrFunc = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.func,
]);

const stringOrArrayOfStrings = PropTypes.oneOfType([
  PropTypes.string,
  React.PropTypes.arrayOf(PropTypes.string),
]);

const arrayOrFunc = PropTypes.oneOfType([
  PropTypes.array,
  PropTypes.func,
]);

const stringOrNumber = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number,
]);

export {
  arrayOrFunc,
  numberOrFunc,
  stringOrArrayOfStrings,
  stringOrFunc,
  stringOrNumber,
};
