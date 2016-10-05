import React, { Component, PropTypes } from 'react';
import * as d3 from 'd3';

export default class HorizontalCurtain extends Component {
  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    classNamePrefix: PropTypes.string,
    height: PropTypes.number,
    areaHeight: PropTypes.number,
    width: PropTypes.number,
    areaWidth: PropTypes.number,
    paddingBottom: PropTypes.number,
    paddingLeft: PropTypes.number,
    paddingRight: PropTypes.number,
    paddingTop: PropTypes.number,
    duration: PropTypes.number,
    delay: PropTypes.number,
  };

  static defaultProps = {
    delay: 0,
    duration: 300,
  };

  componentDidMount () {
    this.animate();
  }

  render () {
    const className = [
      'horizontal-curtain',
    ];
    if (this.props.classNamePrefix) {
      className.push(`${this.props.classNamePrefix}__horizontal-curtain`);
    }
    if (this.props.className) {
      className.push(this.props.className);
    }
    return (
      <clipPath
        id={ this.props.id }
        className={ className.join(' ') }
      >
        <rect
          ref={ n => this.rect = n }
          width={ 0 }
          height={ this.props.areaHeight }
        />
      </clipPath>
    );
  }

  animate () {
    const transition = d3.transition()
      .duration(this.props.duration)
      .delay(this.props.delay);
    const rectSelection = d3.select(this.rect);
    const rectWidth = parseFloat(rectSelection.attr('width') || 0);
    if (this.props.areaWidth && this.props.areaWidth !== rectWidth) {
      rectSelection.transition(transition).attr('width', this.props.areaWidth);
    }
  }
}
