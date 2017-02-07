import React, { Component, PropTypes } from 'react';
import * as d3 from 'd3';
import _ from 'lodash';
import TooltipRenderer from '../helpers/TooltipRenderer';
import { stringOrFunc } from '../propTypes/customPropTypes';

export default class ChoroplethMap extends Component {

  static propTypes = {
    chartData: PropTypes.array,
    className: PropTypes.string,
    classNamePrefix: PropTypes.string,
    paddingBottom: PropTypes.number,
    paddingLeft: PropTypes.number,
    paddingRight: PropTypes.number,
    paddingTop: PropTypes.number,
    topology: PropTypes.shape({
      features: PropTypes.array.isRequired,
    }),
    projection: PropTypes.func,
    areaHeight: PropTypes.number,
    areaWidth: PropTypes.number,
    topologyMatcher: PropTypes.string,
    fillColor: PropTypes.any,
    strokeColor: PropTypes.any,
    children: PropTypes.node,
    mask: stringOrFunc,
    filter: stringOrFunc,
    onTooltipShow: PropTypes.func,
    onTooltipHide: PropTypes.func,
    displayItem: PropTypes.object,
    displayItemFilter: PropTypes.func,
  };

  static defaultProps = {
  };

  componentDidMount () {
    this.tooltipRenderer = new TooltipRenderer(this);
    if (this.hasTooltip()) {
      this.tooltipRenderer.update(React.Children.only(this.props.children));
    }
    this.renderMap();
  }

  componentDidUpdate () {
    this.renderMap();
    if (this.hasTooltip()) {
      this.tooltipRenderer.update(React.Children.only(this.props.children));

      if (this.props.displayItem) {
        this.showTooltipForItem(this.props.displayItem);
      } else {
        this.hideTooltips();
      }
    }
  }

  onTooltipShow = (eventElement) => {
    if (this.props.onTooltipShow) {
      this.props.onTooltipShow(eventElement.data);
    }
  }

  onTooltipHide = (eventElement) => {
    if (this.props.onTooltipHide) {
      this.props.onTooltipHide(eventElement.data);
    }
  }

  getPathGenerator = () => {
    return d3.geoPath().projection(this.getProjection());
  }

  getProjection = () => {
    if (_.isFunction(this.props.projection)) {
      return this.props.projection(this.props);
    }
    return this.props.projection;
  }

  getPathFilter = (d, i) => {
    let filter = this.props.filter;
    if (_.isFunction(filter)) {
      return filter;
    }
    if (_.isArray(filter)) {
      filter = filter[i];
    }
    if (filter) {
      return `url(#${filter})`;
    }
    return null;
  }

  getPathMask = (d, i) => {
    let mask = this.props.mask;
    if (_.isArray(mask)) {
      mask = mask[i];
    }
    if (mask) {
      return `url(#${mask})`;
    }
    return null;
  }

  render () {
    const className = [
      'choropleth-map',
    ];
    if (this.props.classNamePrefix) {
      className.push(`${this.props.classNamePrefix}__choropleth-map`);
    }
    if (this.props.className) {
      className.push(this.props.className);
    }
    return (
      <g
        className={ className.join(' ') }
        transform={ `translate(${this.props.paddingLeft},${this.props.paddingTop})` }
        ref={ n => this.node = n }
      />
    );
  }

  renderMap () {
    const group = d3.select(this.node);
    const features = group.selectAll('.choropleth-map__feature')
      .data(this.generateTopology().features);
    features
      .enter()
      .append('path')
      .attr('class', 'choropleth-map__feature')
      .merge(features)
      .attr('d', this.getPathGenerator())
      .style('fill', this.props.fillColor)
      .style('stroke', this.props.strokeColor)
      .attr('mask', this.getPathMask)
      .style('filter', this.getPathFilter);
    this.renderTooltip();
  }

  renderTooltip () {
    const node = d3.select(this.node);
    const features = node.selectAll('.choropleth-map__feature');
    if (this.hasTooltip()) {
      node.call(this.tooltipRenderer.bind);
      features.on('mouseover.ChoroplethMap', this.tooltipRenderer.onShow);
      features.on('mouseout.ChoroplethMap', this.tooltipRenderer.onHide);
      features.on('mouseover.ChoroplethTooltip', this.onTooltipShow);
      features.on('mouseout.ChoroplethTooltip', this.onTooltipHide);
      node.on('mousemove.ChoroplethMap', this.tooltipRenderer.onMove);
    } else {
      features.on('mouseover.ChoroplethMap', null);
      features.on('mouseout.ChoroplethMap', null);
      features.on('mouseover.ChoroplethTooltip', null);
      features.on('mouseout.ChoroplethTooltip', null);
      node.on('mousemove.ChoroplethMap', null);
    }
  }

  generateTopology () {
    if (this.props.topologyMatcher) {
      const hashMap = this.generateChartDataHash();
      const features = this.props.topology.features.map((feature) => {
        const key = _.get(feature, this.props.topologyMatcher);
        const data = hashMap[key];
        return {
          ...feature,
          data,
        };
      });
      return {
        ...this.props.topology,
        features,
      };
    }
    return this.props.topology;
  }

  generateChartDataHash () {
    const hashMap = {};
    const first = _.first(this.props.chartData) || [];
    first.forEach(d => hashMap[d.xValue] = d);
    return hashMap;
  }

  hasTooltip () {
    return React.Children.count(this.props.children) === 1;
  }

  showTooltipForItem () {
    if (this.props.displayItemFilter) {
      const node = d3.select(this.node);
      const feature = node.selectAll('.choropleth-map__feature').filter(this.props.displayItemFilter);
      feature.each(this.tooltipRenderer.onShow);
    }
  }

  hideTooltips () {
    const node = d3.select(this.node);
    node.selectAll('.choropleth-map__feature').each(this.tooltipRenderer.onHide);
  }
}
