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

  constructor (...args) {
    super(...args);

    this.onDrag = this.onDrag.bind(this);
    this.onLeftHandleDrag = this.onLeftHandleDrag.bind(this);
    this.onRightHandleDrag = this.onRightHandleDrag.bind(this);
  }

  componentDidMount () {
    this.setupListeners();
  }

  componentWillUnmount () {
    this.teardownListeners();
  }

  onDrag () {
    let newX = parseFloat(this.clip.attr('x')) + event.movementX; // eslint-disable-line no-undef
    newX = this.maxAreaBoundary(newX);
    newX = this.minAreaBoundary(newX);

    const newEnd = newX + parseFloat(this.clip.attr('width'));
    const newStartDomain = this.props.xScale.invert(newX);
    const newEndDomain = this.props.xScale.invert(newEnd);

    this.props.onRangeChange(newStartDomain, newEndDomain);
  }

  onLeftHandleDrag () {
    let newX = parseFloat(this.leftHandle.attr('x')) + event.movementX; // eslint-disable-line no-undef

    newX = this.maxAreaBoundary(newX); // right areaWidth boundary
    newX = this.minAreaBoundary(newX); // left areaWidth boundary
    newX = this.minWidthRightBoundary(newX); // rightHandle boundary
    newX = this.maxWidthRightBoundary(newX); // max Width boundary

    const newStartDomain = this.props.xScale.invert(newX);
    this.props.onRangeChange(newStartDomain, this.props.end);
  }

  onRightHandleDrag () {
    let newX = parseFloat(this.rightHandle.attr('x')) + event.movementX; // eslint-disable-line no-undef

    newX = this.maxAreaBoundary(newX); // right areaWidth boundary
    newX = this.minAreaBoundary(newX); // left areaWidth boundary
    newX = this.minWidthLeftBoundary(newX); // LeftHandle boundary
    newX = this.maxWidthLeftBoundary(newX); // max Width boundary

    const newEndDomain = this.props.xScale.invert(newX);
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

  minClipWidthPixels () { // returns min width range in px
    let boundary;
    if (this.props.start instanceof Date) {
      boundary = moment(this.props.start).add(this.props.minClipWidth, 'millisecond');
    } else {
      boundary = this.props.start + this.props.minClipWidth;
    }

    return Math.abs(this.props.xScale(this.props.start) - this.props.xScale(boundary));
  }

  maxClipWidthPixels () { // returns max width range in px
    let boundary;
    if (this.props.start instanceof Date) {
      boundary = moment(this.props.start).add(this.props.maxClipWidth, 'millisecond');
    } else {
      boundary = this.props.start + this.props.maxClipWidth;
    }
    return Math.abs(this.props.xScale(this.props.start) - this.props.xScale(boundary));
  }

  minWidthRightBoundary (newX) {
    const rightBoundary = Math.abs(parseFloat(this.rightHandle.attr('x')) - this.minClipWidthPixels());
    return Math.min(newX, rightBoundary);
  }

  maxWidthRightBoundary (newX) {
    const rightBoundary = Math.abs(parseFloat(this.rightHandle.attr('x')) - this.maxClipWidthPixels());
    return Math.max(rightBoundary, newX);
  }

  minWidthLeftBoundary (newX) {
    const leftBoundary = Math.abs(parseFloat(this.leftHandle.attr('x')) + this.minClipWidthPixels());
    return Math.max(newX, leftBoundary);
  }

  maxWidthLeftBoundary (newX) {
    const leftBoundary = Math.abs(parseFloat(this.leftHandle.attr('x')) + this.maxClipWidthPixels());
    return Math.min(leftBoundary, newX);
  }

  maxAreaBoundary (newX) {
    const maxRight = this.props.paddingLeft + this.props.areaWidth;
    return Math.min(newX, maxRight - parseFloat(this.clip.attr('width')));
  }

  minAreaBoundary (newX) {
    return Math.max(this.props.paddingLeft, newX);
  }

  teardownListeners () {
    this.clip.off('drag');
    this.leftHandle.off('drag');
    this.rightHandle.off('drag');
  }
}
