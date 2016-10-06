import React from 'react';

const BlurFilter = (props) => {
  return (
    <defs>
      <filter
        id={ props.id }
        x={ props.blurSize }
        y={ props.blurSize }
        width={ props.width }
        height={ props.height }
      >
        <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
      </filter>
    </defs>
  );
};
BlurFilter.propTypes = {
  blurSize: React.PropTypes.number,
  id: React.PropTypes.string,
  width: React.PropTypes.number,
  height: React.PropTypes.number,
};
BlurFilter.defaultProps = {
  blurSize: -4,
  id: 'blurFilter',
};
export default BlurFilter;
