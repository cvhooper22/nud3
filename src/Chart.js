import React, { Component, PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import _ from 'lodash';
import * as d3 from 'd3';
import dataDenormalizer from './helpers/dataDenormalizer';
import {
  stringOrFunc,
  arrayOrFunc,
  stringOrNumber,
} from './propTypes/customPropTypes';
import {
  updateYScaleDomain,
  updateXScaleDomain,
} from './helpers/scaleHelpers';
import splitHTMLElementProps from './helpers/splitHTMLElementProps';

export default class Chart extends Component {

  static propTypes = {
    DEBUG: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string,
    data: PropTypes.array,
    height: stringOrNumber,
    id: PropTypes.string,
    paddingBottom: PropTypes.number,
    paddingLeft: PropTypes.number,
    paddingRight: PropTypes.number,
    paddingTop: PropTypes.number,
    resizeDebounce: PropTypes.number,
    valueKeys: PropTypes.array,
    width: stringOrNumber,
    xKey: PropTypes.string,
    xScale: stringOrFunc,
    xScaleDomain: arrayOrFunc,
    xmlns: PropTypes.string.isRequired,
    yScale: stringOrFunc,
    yScaleDomain: arrayOrFunc,
    yScaleMaximum: PropTypes.number,
    yScaleMinimum: PropTypes.number,
    rangeRound: PropTypes.bool,
  };

  static defaultProps = {
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    resizeDebounce: 100,
    valueKeys: ['value'],
    xScale: 'scaleTime',
    xmlns: 'http://www.w3.org/2000/svg',
    yScale: 'scaleLinear',
    rangeRound: false,
  };

  constructor (props, ...args) {
    super(props, ...args);
    this.onWindowResize = _.debounce(this.onWindowResize, props.resizeDebounce);
    this.setupData(props);
    this.state = {};
  }

  componentDidMount () {
    this.resize(this.props);
    window.addEventListener('resize', this.onWindowResize);
  }

  componentWillReceiveProps (nextProps) {
    this.setupData(nextProps);
    this.resize(nextProps);
  }

  shouldComponentUpdate (...args) {
    return shallowCompare(this, ...args);
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.onWindowResize);
  }

  onWindowResize = () => {
    if (this.node) {
      this.resize(this.props);
    }
  }

  setupData (props) {
    const data = this.calculateData(props);
    this.xScale = this.setupScale(props.xScale);
    this.yScale = this.setupScale(props.yScale);
    this.updateScalesFromData(props, data);
    this.chartData = data || [];
  }

  setupScale (prop) {
    return _.isFunction(prop) ? prop() : d3[prop]();
  }

  render () {
    const [elementProps] = splitHTMLElementProps(this.props);
    const style = { ...(elementProps.style || {}) };
    if (this.props.height) {
      style.height = this.sizeToStyle(this.props.height);
    }
    if (this.props.width) {
      style.width = this.sizeToStyle(this.props.width);
    }
    delete elementProps.data;
    delete elementProps.height;
    delete elementProps.width;
    delete elementProps.style;
    return (
      <svg
        { ...elementProps }
        style={ style }
        ref={ n => this.node = n }
        viewBox={ `0 0 ${this.state.width} ${this.state.height}` }
      >
        { this.renderChildren() }
      </svg>
    );
  }

  renderChildren () {
    if (!this.node) {
      return undefined;
    }
    return React.Children.map(this.props.children, this.renderChild);
  }

  renderChild = (child, i = 0) => {
    if (typeof child.type === 'string') {
      return child;
    }
    return React.cloneElement(child, {
      key: i,
      originalData: this.props.data,
      chartData: this.chartData,
      xScale: this.xScale,
      yScale: this.yScale,
      xScaleDomain: this.props.xScaleDomain,
      yScaleDomain: this.props.yScaleDomain,
      classNamePrefix: this.props.className,
      paddingBottom: this.props.paddingBottom,
      paddingLeft: this.props.paddingLeft,
      paddingRight: this.props.paddingRight,
      paddingTop: this.props.paddingTop,
      valueKeys: this.props.valueKeys,
      ...this.state,
      ...child.props,
      children: child.props.children,
      DEBUG: this.props.DEBUG,
    });
  }

  calculateData (props) {
    return this.calculateDenormalizedData(props.valueKeys || [], props.xKey, props.data || []);
  }

  calculateDenormalizedData (valueKeys, xKey, data) {
    return valueKeys.map(valueKey => dataDenormalizer(data || [], xKey, valueKey));
  }

  updateScalesFromData (props, data) {
    if (props.xKey) {
      updateXScaleDomain(this.xScale, props, data);
    }
    updateYScaleDomain(this.yScale, props, data);
  }

  resize (props) {
    if (!this.node) {
      return; // its debounced so its possible that its unmounted.
    }
    const rect = this.node.getBoundingClientRect();
    const height = props.height || rect.height;
    const width = props.width || rect.width;
    const areaWidth = width - (props.paddingLeft + props.paddingRight);
    const areaHeight = height - (props.paddingTop + props.paddingBottom);
    const rangeMethod = props.rangeRound ? 'rangeRound' : 'range';
    this.xScale[rangeMethod]([0, areaWidth]);
    this.yScale[rangeMethod]([areaHeight, 0]);
    this.setState({
      height,
      width,
      areaHeight,
      areaWidth,
    });
    if (props.DEBUG) {
      /* eslint-disable no-console */
      console.debug('xScale range:', [0, areaWidth]);
      console.debug('yScale range:', [areaHeight, 0]);
      console.debug(`settingSize: height:${height}, width:${width}, areaHeight:${areaHeight}, areaWidth:${areaWidth}`);
    }
  }

  sizeToStyle (size) {
    if (_.isString(size) && _.endsWith(size, '%')) {
      return size;
    }
    return `${size}px`;
  }
}
