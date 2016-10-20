import React, { Component, PropTypes } from 'react';
import * as d3 from 'd3';
import {
  Chart,
  LineChart,
  AxisBottom,
  AxisLeft,
  PadDataBetweenDates,
  HorizontalHoverBar,
  VerticalHoverBar,
  TooltipPositions,
  VerticalGrid,
  HorizontalGrid
} from 'nud3';

export default class RangeSelector extends Component {

  static propTypes = {
    className: PropTypes.string,
    onClipChange: PropTypes.func,
    clipRange: PropTypes.array
  }
 
  constructor (...args) {
    super(...args);
    this.d3 = d3;
    this.state = {
      clipWidth: 100,
    };
  }

  componentDidMount () {
    this.renderClip();
    this.setupListeners();
  }

  componentDidUpdate () {
    this.renderClip();
  }

  componentWillUnmount () {
    this.teardownListeners();
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
    return (<g className={ this.getClassNames() }
               ref={ n => this.node = d3.select(n) }>
               <rect className={ "left-bar" }
                     height={ this.props.areaHeight }
                     width={ 5 }
                     y={ this.props.paddingTop }
                     x={ this.props.paddingLeft - 5}
                     ref={ n => this.leftHandle = d3.select(n) } />
               <rect className={ "clip" }
                     height={ this.props.areaHeight }
                     width={ this.state.clipWidth }
                     y = { this.props.paddingTop }
                     ref={ n => this.clip = d3.select(n) }/>
               <rect className={ "right-bar" }
                     height={ this.props.areaHeight }
                     width={ 5 }
                     x={ this.props.paddingLeft + this.state.clipWidth }
                     y = { this.props.paddingTop }
                     ref={ n => this.rightHandle = d3.select(n) } />                     
            </g>);
  }
  
  setupListeners () {
    this.clip.call( this.d3.drag().on("drag", this.onDrag.bind(this) ) );
    this.leftHandle.call( this.d3.drag().on("drag", this.onLeftPull.bind(this) ) );
    this.rightHandle.call( this.d3.drag().on("drag", this.onRightPull.bind(this) ) );
  }

  renderClip () {
    this.clip.attr("width", this.state.clipWidth)
             .attr("x", this.props.paddingLeft)
             .attr("y", this.props.paddingTop)
  }

  onDrag (_un, index, selection) {
    const x = this.calculateClipXPosition(event.movementX);

    this.clip.attr("x", selection.x = x);
    this.leftHandle.attr("x", selection.x = x - 5);// 5 is the handle width
    this.rightHandle.attr("x", selection.x = x + this.clip.attr("width")*1);
  }

  onLeftPull (_un, index, selection) {
    const x = this.calculateClipXPosition(event.movementX);

    this.clip.attr("width", this.calculatedClipWidth(event.movementX))
             .attr("x", selection.x = x);
    this.leftHandle.attr("x", selection.x = x - 5); // 5 is the handle width
  }

  onRightPull (_un, index, selection) {
    const x = this.calculateClipXPosition(-event.movementX);
    const width = this.calculatedClipWidth(-event.movementX);

    this.clip.attr("width", width)
    this.rightHandle.attr("x", selection.x = x*1 + width*1);
  }

  calculatedClipWidth (movement) {
    const potentialWidth = this.clip.attr("width")*1 - movement;
    const minWidth = Math.max(1, potentialWidth);
    const boundedWidth = Math.min(minWidth, this.props.areaWidth);
    const xPosition = this.clip.attr("x");

    return xPosition == this.minLeftPosition() ? this.clip.attr("width")*1 : boundedWidth;
  }

  calculateClipXPosition (movement) {
    const currentXPosition = this.clip.attr("x")*1;
    const potentialXPosition = currentXPosition + movement;
    const max = Math.min(potentialXPosition, this.maxRightPosition());

    return Math.max(this.minLeftPosition(), max);
  }

  maxRightPosition () {
    return this.props.width - this.props.paddingRight - this.clip.attr("width")*1;
  }

  minLeftPosition () {
    return this.props.paddingLeft;
  }

  teardownListeners () {
    this.clip.call( this.d3.drag().on("drag", null ) );
    this.leftHandle.call( this.d3.drag().on("drag", null ) );
    this.rightHandle.call( this.d3.drag().on("drag", null ) );
  }
}