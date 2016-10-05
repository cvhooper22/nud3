import React, { Component, PropTypes } from 'react';
import * as d3 from 'd3';

export default class VerticalCurtain extends Component {
  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    classNamePrefix: PropTypes.string,
    height: PropTypes.number,
    areaHeight: PropTypes.number,
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
      'vertical-curtain',
    ];
    if (this.props.classNamePrefix) {
      className.push(`${this.props.classNamePrefix}__vertical-curtain`);
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
          transform={ `translate(0,${this.props.areaHeight})` }
          ref={ n => this.rect = n }
          width={ this.props.areaWidth }
          height={ 0 }
        />
      </clipPath>
    );
  }

  animate () {
    const transition = d3.transition()
      .duration(this.props.duration)
      .delay(this.props.delay);
    const rectSelection = d3.select(this.rect);
    const rectHeight = parseFloat(rectSelection.attr('height') || 0);
    if (this.props.areaHeight && this.props.areaHeight !== rectHeight) {
      rectSelection
        .transition(transition)
        .attr('height', this.props.areaHeight)
        .attr('transform', 'translate(0,0)');
    }
  }
}
