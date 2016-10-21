import React, { Component, PropTypes } from 'react';
import * as d3 from 'd3';
import moment from 'moment';

export default class RangeSelector extends Component {

  static propTypes = {
    className: PropTypes.string,
    onRangeChange: PropTypes.func,
    handleWidth: PropTypes.number,
    classNamePrefix: PropTypes.string,
    width: PropTypes.number,
    minClipWidth: PropTypes.number,
    maxClipWidth: PropTypes.number,
    areaWidth: PropTypes.number,
    paddingTop: PropTypes.number,
    paddingLeft: PropTypes.number,
    paddingRight: PropTypes.number,
    areaHeight: PropTypes.number,
    xScale: PropTypes.func,
    start: PropTypes.object,
    end: PropTypes.object,
  }

  componentDidMount () {
    this.setupListeners();
  }

  componentDidUpdate () {
    // this.renderClip();
  }

  componentWillUnmount () {
    this.teardownListeners();
  }

  onDrag () {
    const newStart = this.boundedXPosition(event.movementX);
    const newEnd = newStart + parseFloat(this.clip.attr('width'));

    const newStartDomain = this.props.xScale.invert(newStart);
    const newEndDomain = this.props.xScale.invert(newEnd);

    this.props.onRangeChange(newStartDomain, newEndDomain);
  }

  onLeftHandleDrag () {
    let newStart = this.boundedXPosition(event.movementX);

    // This if prevents handles from crossing
    if (newStart > parseFloat(this.rightHandle.attr('x')) - this.props.minClipWidth) {
      newStart = parseFloat(this.rightHandle.attr('x')) - this.props.minClipWidth;
    }

    const newStartDomain = this.props.xScale.invert(newStart);
    const sameEndDomain = this.props.end;
    this.props.onRangeChange(newStartDomain, sameEndDomain);
  }

  onRightHandleDrag () {
    const start = parseFloat(this.clip.attr('x'));
    let newWidth = parseFloat(this.clip.attr('width')) + event.movementX;

    // This if prevents handles from crossing
    if (newWidth < this.props.minClipWidth) {
      newWidth = this.props.minClipWidth;
    }

    const maxRightPosition = this.props.paddingLeft + this.props.areaWidth;
    const newEnd = Math.min(start + newWidth, maxRightPosition);
    const newEndDomain = this.props.xScale.invert(newEnd);
    const sameStartDomain = this.props.start;
    this.props.onRangeChange(sameStartDomain, newEndDomain);
  }

  setupListeners () {
    this.clip.call(d3.drag().on('drag', this.onDrag.bind(this)));
    this.leftHandle.call(d3.drag().on('drag', this.onLeftHandleDrag.bind(this)));
    this.rightHandle.call(d3.drag().on('drag', this.onRightHandleDrag.bind(this)));
  }

  getClassNames () {
    const className = [
      'range-selector',
    ];
    if (this.props.classNamePrefix) {
      className.push(`${this.props.classNamePrefix}__range-selector`);
    }
    if (this.props.className) {
      className.push(this.props.className);
    }
    return className.join(' ');
  }

  render () {
    const y = this.props.paddingTop;
    const height = this.props.areaHeight;
    const start = this.props.xScale(this.props.start);
    const end = this.props.xScale(this.props.end);
//     const convertedMin = this.props.xScale(this.props.minClipWidth);
//     const convertedMax = this.props.xScale(this.props.maxClipWidth);

//     const minWidth = Math.max(convertedMin, end - start);
//     const width = Math.min(minWidth, convertedMax);
    const a = moment();
    const b = moment().subtract(1, 'day');
    const width = 25;
    console.log(a);
    console.log(b);
    return (
      <g
        className={ this.getClassNames() }
        ref={ n => this.node = d3.select(n) }
      >
        <rect
          className={ 'clip' }
          height={ height }
          width={ width }
          x={ start }
          y={ y }
          ref={ n => this.clip = d3.select(n) }
        />
        <rect
          className={ 'left-handle' }
          height={ height }
          width={ this.props.handleWidth }
          x={ start }
          y={ y }
          ref={ n => this.leftHandle = d3.select(n) }
        />
        <rect
          className={ 'right-handle' }
          height={ height }
          width={ this.props.handleWidth }
          x={ end }
          y={ y }
          ref={ n => this.rightHandle = d3.select(n) }
        />
      </g>);
  }

  calculatedClipWidth (movementX) {
    const potentialWidth = parseFloat(this.clip.attr('width')) - movementX;
    const minWidth = Math.max(1, potentialWidth);
    const boundedWidth = Math.min(minWidth, this.props.areaWidth);
    const xPosition = this.clip.attr('x');

    return xPosition === this.minLeftPosition() ? parseFloat(this.clip.attr('width')) : boundedWidth;
  }

  boundedXPosition (movementX) {
    const potentialXPosition = parseFloat(this.clip.attr('x')) + movementX;
    const max = Math.min(potentialXPosition, this.maxRightXPosition());

    return Math.max(this.minLeftPosition(), max);
  }

  maxRightXPosition () {
    const maxRight = this.props.paddingLeft + this.props.areaWidth;
    return maxRight - parseFloat(this.clip.attr('width'));
  }

  minLeftPosition () {
    return this.props.paddingLeft;
  }

  teardownListeners () {
    this.clip.on('drag', null);
    this.leftHandle.on('drag', null);
    this.rightHandle.on('drag', null);
  }
}
