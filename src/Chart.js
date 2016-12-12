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
  };

  static defaultProps = {
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    resizeDebounce: 50,
    valueKeys: ['value'],
    xScale: 'scaleTime',
    xmlns: 'http://www.w3.org/2000/svg',
    yScale: 'scaleLinear',
  };

  constructor (props, ...args) {
    super(props, ...args);
    this.renderChild = ::this.renderChild;
    this.onWindowResize = _.debounce(::this.onWindowResize, props.resizeDebounce);
    this.setupData(props);
    this.state = {};
  }

  componentDidMount () {
    this.resize();
    window.addEventListener('resize', this.onWindowResize);
  }

  componentWillReceiveProps (nextProps) {
    this.setupData(nextProps);
    this.resize();
  }

  shouldComponentUpdate (...args) {
    return shallowCompare(this, ...args);
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.onWindowResize);
  }

  onWindowResize () {
    this.resize();
  }

  setupData () {
    const data = this.calculateData();
    this.xScale = this.setupScale(this.props.xScale);
    this.yScale = this.setupScale(this.props.yScale);
    this.updateScalesFromData(data);
    this.chartData = data;
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

  renderChild (child, i = 0) {
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

  calculateData () {
    return this.calculateDenormalizedData(this.props.data || []);
  }

  calculateDenormalizedData (data) {
    return this.props.valueKeys.map(valueKey => dataDenormalizer(data || [], this.props.xKey, valueKey));
  }

  updateScalesFromData (data) {
    if (this.props.xKey) {
      this.updateXScaleDomain(data);
    }
    this.updateYScaleDomain(data);
  }

  updateYScaleDomain (data) {
    if (this.props.yScaleDomain) {
      if (_.isFunction(this.props.yScaleDomain)) {
        this.yScale.domain(this.props.yScaleDomain(data));
      } else {
        this.yScale.domain(this.props.yScaleDomain);
      }
    } else {
      const allExtents = _.flatten(data.map(datum => d3.extent(datum, d => d.yValue)));
      const valueExtent = d3.extent(allExtents);
      if (this.props.yScaleMinimum !== undefined) {
        valueExtent[0] = this.props.yScaleMinimum;
      }
      if (this.props.yScaleMaximum !== undefined) {
        valueExtent[1] = this.props.yScaleMaximum;
      }
      this.yScale.domain(valueExtent);
      if (this.props.DEBUG) {
        /* eslint-disable no-console */
        console.debug('yScale domain', valueExtent);
      }
    }
  }

  updateXScaleDomain (data) {
    let domain;
    if (this.props.xScaleDomain) {
      if (_.isFunction(this.props.xScaleDomain)) {
        domain = this.props.xScaleDomain(data);
      } else {
        domain = this.props.xScaleDomain;
      }
    } else {
      const first = _.first(this.props.data);
      const last = _.last(this.props.data);
      if (first && last) {
        domain = [first[this.props.xKey], last[this.props.xKey]];
      }
    }
    if (domain) {
      this.xScale.domain(domain);
      if (this.props.DEBUG) {
        /* eslint-disable no-console */
        console.debug('xScale domain', domain);
      }
    }
  }

  resize () {
    if (!this.node) {
      return; // its debounced so its possible that its unmounted.
    }
    const rect = this.node.getBoundingClientRect();
    const height = this.props.height || rect.height;
    const width = this.props.width || rect.width;
    const areaWidth = width - (this.props.paddingLeft + this.props.paddingRight);
    const areaHeight = height - (this.props.paddingTop + this.props.paddingBottom);
    this.xScale.range([0, areaWidth]);
    this.yScale.range([areaHeight, 0]);
    this.setState({
      height,
      width,
      areaHeight,
      areaWidth,
    });
    if (this.props.DEBUG) {
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
