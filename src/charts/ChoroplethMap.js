import React, { Component, PropTypes } from 'react';
import * as d3 from 'd3';
import _ from 'lodash';
import TooltipRenderer from '../helpers/TooltipRenderer';

export default class ChoroplethMap extends Component {

  static propTypes = {
    chartData: PropTypes.array,
    className: PropTypes.string,
    classNamePrefix: PropTypes.string,
    paddingBottom: PropTypes.number,
    paddingLeft: PropTypes.number,
    paddingRight: PropTypes.number,
    paddingTop: PropTypes.number,
    topology: PropTypes.object,
    projection: PropTypes.func,
    areaHeight: PropTypes.number,
    areaWidth: PropTypes.number,
    topologyMatcher: PropTypes.string,
    fillColor: PropTypes.any,
    strokeColor: PropTypes.any,
    children: PropTypes.node,
  };

  static defaultProps = {
  };

  componentDidMount () {
    this.tooltipRenderer = new TooltipRenderer();
    if (this.hasTooltip()) {
      this.tooltipRenderer.update(React.Children.only(this.props.children));
    }
    this.renderMap();
  }

  componentDidUpdate () {
    this.renderMap();
    if (this.hasTooltip()) {
      this.tooltipRenderer.update(React.Children.only(this.props.children));
    }
  }

  getPathGenerator () {
    return d3.geoPath().projection(this.getProjection());
  }

  getProjection () {
    if (_.isFunction(this.props.projection)) {
      return this.props.projection(this.props);
    }
    return this.props.projection;
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
    group.selectAll('.choropleth-map__feature')
      .data(this.generateTopology().features)
      .enter()
      .append('path')
      .attr('class', 'choropleth-map__feature');

    const features = group.selectAll('.choropleth-map__feature')
      .attr('d', this.getPathGenerator());
    if (this.props.fillColor) {
      features.style('fill', this.props.fillColor);
    } else {
      features.style('fill', null);
    }
    if (this.props.strokeColor) {
      features.style('stroke', this.props.strokeColor);
    } else {
      features.style('stroke', null);
    }
    this.renderTooltip();
  }

  renderTooltip () {
    const group = d3.select(this.node);
    const features = group.selectAll('.choropleth-map__feature');
    if (this.hasTooltip()) {
      group.call(this.tooltipRenderer.bind);
      features.on('mouseover', this.tooltipRenderer.onShow);
      features.on('mouseout', this.tooltipRenderer.onHide);
    } else {
      features.on('mouseover', null);
      features.on('mouseout', null);
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
}
