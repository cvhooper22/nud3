import React, { Component, PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import _ from 'lodash';
import * as d3 from 'd3';
import dataDenormalizer from './helpers/dataDenormalizer';
import { stringOrFunc } from './propTypes/customPropTypes';

export default class Chart extends Component {

  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    data: PropTypes.array,
    xKey: PropTypes.string,
    height: PropTypes.number,
    id: PropTypes.string,
    paddingBottom: PropTypes.number,
    paddingLeft: PropTypes.number,
    paddingRight: PropTypes.number,
    paddingTop: PropTypes.number,
    tagName: PropTypes.string,
    valueKeys: PropTypes.array,
    width: PropTypes.number,
    xScale: stringOrFunc,
    yScale: stringOrFunc,
    yScaleMinimum: PropTypes.number,
    yScaleMaximum: PropTypes.number,
    resizeDebounce: PropTypes.number,
  };

  static defaultProps = {
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    tagName: 'svg',
    valueKeys: ['value'],
    xScale: 'scaleTime',
    yScale: 'scaleLinear',
    resizeDebounce: 50,
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
    const Tag = this.props.tagName;
    const style = {};
    if (this.props.height) {
      style.height = `${this.props.height}px`;
    }
    if (this.props.width) {
      style.width = `${this.props.width}px`;
    }
    return (
      <Tag
        id={ this.props.id }
        className={ this.props.className }
        style={ style }
        ref={ n => this.node = n }
      >
        { this.renderChildren() }
      </Tag>
    );
  }

  renderChildren () {
    if (!this.node) {
      return undefined;
    }
    return React.Children.map(this.props.children, this.renderChild);
  }

  renderChild (child, i = 0) {
    return React.cloneElement(child, {
      key: i,
      originalData: this.props.data,
      chartData: this.chartData,
      xScale: this.xScale,
      yScale: this.yScale,
      classNamePrefix: this.props.className,
      paddingBottom: this.props.paddingBottom,
      paddingLeft: this.props.paddingLeft,
      paddingRight: this.props.paddingRight,
      paddingTop: this.props.paddingTop,
      valueKeys: this.props.valueKeys,
      ...this.state,
      ...child.props,
    });
  }

  calculateData () {
    return this.calculateDenormalizedData(this.props.data || []);
  }

  calculateDenormalizedData (data) {
    return this.props.valueKeys.map(valueKey => dataDenormalizer(data || [], this.props.xKey, valueKey));
  }

  updateScalesFromData (data) {
    this.updateXScaleFromData();
    const allExtents = _.flatten(data.map(datum => d3.extent(datum, d => d.yValue)));
    const valueExtent = d3.extent(allExtents);
    if (this.props.yScaleMinimum !== undefined) {
      valueExtent[0] = this.props.yScaleMinimum;
    }
    if (this.props.yScaleMaximum !== undefined) {
      valueExtent[1] = this.props.yScaleMaximum;
    }
    this.yScale.domain(valueExtent);
  }

  updateXScaleFromData () {
    if (this.props.xKey) {
      const first = _.first(this.props.data);
      const last = _.last(this.props.data);
      if (first && last) {
        this.xScale.domain([first[this.props.xKey], last[this.props.xKey]]);
      }
    }
  }

  resize () {
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
  }
}
