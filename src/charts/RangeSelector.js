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

  componentWillUnmount () {
    this.teardownListeners();
  }

  onDrag () {
    let newX = parseFloat(this.clip.attr('x')) + event.movementX;
    newX = Math.min(newX, this.maxAreaBoundary());
    newX = Math.max(this.minAreaBoundary(), newX);

    const newEnd = newX + parseFloat(this.clip.attr('width'));
    const newStartDomain = this.props.xScale.invert(newX);
    const newEndDomain = this.props.xScale.invert(newEnd);

    this.props.onRangeChange(newStartDomain, newEndDomain);
  }

  onLeftHandleDrag () {
    let newX = parseFloat(this.leftHandle.attr('x')) + event.movementX;

    newX = Math.min(newX, this.maxAreaBoundary()); // right areaWidth boundary
    newX = Math.max(this.minAreaBoundary(), newX); // left areaWidth boundary
    newX = Math.min(newX, this.minWidthRightBoundary()); // rightHandle boundary
    newX = Math.max(this.maxWidthRightBoundary(), newX); // max Width boundary

    const newStartDomain = this.props.xScale.invert(newX);
    this.props.onRangeChange(newStartDomain, this.props.end);
  }

  onRightHandleDrag () {
    let newX = parseFloat(this.rightHandle.attr('x')) + event.movementX;

    newX = Math.min(newX, this.maxAreaBoundary()); // right areaWidth boundary
    newX = Math.max(this.minAreaBoundary(), newX); // left areaWidth boundary
    newX = Math.max(newX, this.minWidthLeftBoundary()); // LeftHandle boundary
    newX = Math.min(this.maxWidthLeftBoundary(), newX); // max Width boundary

    const newEndDomain = this.props.xScale.invert(newX);
    this.props.onRangeChange(this.props.start, newEndDomain);
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
      boundary = moment(this.props.start).add(this.props.minClipWidth, 'minutes');
    } else {
      boundary = this.props.start + this.props.minClipWidth;
    }

    return Math.abs(this.props.xScale(this.props.start) - this.props.xScale(boundary));
  }

  maxClipWidthPixels () { // returns max width range in px
    let boundary;
    if (this.props.start instanceof Date) {
      boundary = moment(this.props.start).add(this.props.maxClipWidth, 'minutes');
    } else {
      boundary = this.props.start + this.props.maxClipWidth;
    }
    return Math.abs(this.props.xScale(this.props.start) - this.props.xScale(boundary));
  }

  minWidthRightBoundary () {
    return Math.abs(parseFloat(this.rightHandle.attr('x')) - this.minClipWidthPixels());
  }

  maxWidthRightBoundary () {
    return Math.abs(parseFloat(this.rightHandle.attr('x')) - this.maxClipWidthPixels());
  }

  minWidthLeftBoundary () {
    return Math.abs(parseFloat(this.leftHandle.attr('x')) + this.minClipWidthPixels());
  }

  maxWidthLeftBoundary () {
    return Math.abs(parseFloat(this.leftHandle.attr('x')) + this.maxClipWidthPixels());
  }

  maxAreaBoundary () {
    const maxRight = this.props.paddingLeft + this.props.areaWidth;
    return maxRight - parseFloat(this.clip.attr('width'));
  }

  minAreaBoundary () {
    return this.props.paddingLeft;
  }

  teardownListeners () {
    this.clip.on('drag', null);
    this.leftHandle.on('drag', null);
    this.rightHandle.on('drag', null);
  }
}
