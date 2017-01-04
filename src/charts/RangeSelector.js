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
    minClipSize: PropTypes.number,
    maxClipSize: PropTypes.number,
    areaWidth: PropTypes.number,
    paddingTop: PropTypes.number,
    paddingLeft: PropTypes.number,
    paddingRight: PropTypes.number,
    areaHeight: PropTypes.number,
    xScale: PropTypes.func,
    start: PropTypes.object,
    end: PropTypes.object,
  }

  static defaultProps = {
    handleWidth: 5,
  };

  constructor (...args) {
    super(...args);

    this.onDrag = ::this.onDrag;
    this.onLeftHandleDrag = ::this.onLeftHandleDrag;
    this.onRightHandleDrag = ::this.onRightHandleDrag;
  }

  componentDidMount () {
    this.setupListeners();
  }

  componentWillUnmount () {
    this.teardownListeners();
  }

  onDrag () {
    let newXPosition = parseFloat(this.clip.attr('x')) + event.movementX; // eslint-disable-line no-undef
    newXPosition = this.rightAreaBoundary(newXPosition);
    newXPosition = this.leftAreaBoundary(newXPosition);

    const newEnd = newXPosition + parseFloat(this.clip.attr('width'));
    const newStartDomain = this.props.xScale.invert(newXPosition);
    const newEndDomain = this.props.xScale.invert(newEnd);

    this.props.onRangeChange(newStartDomain, newEndDomain);
  }

  onLeftHandleDrag () {
    let newXPosition = parseFloat(this.leftHandle.attr('x')) + event.movementX; // eslint-disable-line no-undef

    newXPosition = this.rightAreaBoundary(newXPosition); // right areaWidth boundary
    newXPosition = this.leftAreaBoundary(newXPosition); // left areaWidth boundary
    newXPosition = this.determinMinRightPosition(newXPosition); // rightHandle boundary
    newXPosition = this.determineMaxRightPosition(newXPosition); // max Width boundary

    const newStartDomain = this.props.xScale.invert(newXPosition);
    this.props.onRangeChange(newStartDomain, this.props.end);
  }

  onRightHandleDrag () {
    let newXPosition = parseFloat(this.rightHandle.attr('x')) + event.movementX; // eslint-disable-line no-undef

    newXPosition = this.rightAreaBoundary(newXPosition); // right areaWidth boundary
    newXPosition = this.leftAreaBoundary(newXPosition); // left areaWidth boundary
    newXPosition = this.determineMinLeftPosition(newXPosition); // LeftHandle boundary
    newXPosition = this.determineMaxLeftPosition(newXPosition); // max Width boundary

    const newEndDomain = this.props.xScale.invert(newXPosition);
    this.props.onRangeChange(this.props.start, newEndDomain);
  }

  setupListeners () {
    this.clip.call(d3.drag().on('drag.RangeSelectorDrag', this.onDrag));
    this.leftHandle.call(d3.drag().on('drag.RangeSelectorLeftHandle', this.onLeftHandleDrag));
    this.rightHandle.call(d3.drag().on('drag.RangeSelectorRightHandle', this.onRightHandleDrag));
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
    const width = Math.abs(start - end);

    return (
      <g
        className={ this.getClassNames() }
        ref={ n => this.node = d3.select(n) }
      >
        <rect
          className="range-selector__handle range-selector__handle--middle"
          height={ height }
          width={ width }
          x={ start }
          y={ y }
          ref={ n => this.clip = d3.select(n) }
        />
        <rect
          className="range-selector__handle range-selector__handle--right"
          height={ height }
          width={ this.props.handleWidth }
          x={ start }
          y={ y }
          ref={ n => this.leftHandle = d3.select(n) }
        />
        <rect
          className="range-selector__handle range-selector__handle--right"
          height={ height }
          width={ this.props.handleWidth }
          x={ end }
          y={ y }
          ref={ n => this.rightHandle = d3.select(n) }
        />
      </g>);
  }

  minClipSizePixels () { // returns min width range in px
    let boundary;
    if (this.props.start instanceof Date) {
      boundary = moment(this.props.start).add(this.props.minClipSize, 'millisecond');
    } else {
      boundary = this.props.start + this.props.minClipSize;
    }

    return Math.abs(this.props.xScale(this.props.start) - this.props.xScale(boundary));
  }

  maxClipSizePixels () { // returns max width range in px
    let boundary;
    if (this.props.start instanceof Date) {
      boundary = moment(this.props.start).add(this.props.maxClipSize, 'millisecond');
    } else {
      boundary = this.props.start + this.props.maxClipSize;
    }
    return Math.abs(this.props.xScale(this.props.start) - this.props.xScale(boundary));
  }

  determinMinRightPosition (newX) {
    const rightBoundary = Math.abs(parseFloat(this.rightHandle.attr('x')) - this.minClipSizePixels());
    return Math.min(newX, rightBoundary);
  }

  determineMaxRightPosition (newX) {
    const rightBoundary = Math.abs(parseFloat(this.rightHandle.attr('x')) - this.maxClipSizePixels());
    return Math.max(rightBoundary, newX);
  }

  determineMinLeftPosition (newX) {
    const leftBoundary = Math.abs(parseFloat(this.leftHandle.attr('x')) + this.minClipSizePixels());
    return Math.max(newX, leftBoundary);
  }

  determineMaxLeftPosition (newX) {
    const leftBoundary = Math.abs(parseFloat(this.leftHandle.attr('x')) + this.maxClipSizePixels());
    return Math.min(leftBoundary, newX);
  }

  rightAreaBoundary (newX) {
    const maxRight = this.props.paddingLeft + this.props.areaWidth;
    return Math.min(newX, maxRight - parseFloat(this.clip.attr('width')));
  }

  leftAreaBoundary (newX) {
    return Math.max(this.props.paddingLeft, newX);
  }

  teardownListeners () {
    this.clip.on('drag', null);
    this.leftHandle.on('drag', null);
    this.rightHandle.on('drag', null);
  }
}
