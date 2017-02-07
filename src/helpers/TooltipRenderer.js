import React from 'react';
import ReactDOM from 'react-dom';
import { mouse } from 'd3';
import curryThisElement from './curryThisElement';
import tooltipPositioner from './tooltipPositioner';
import TooltipPositions from './TooltipPositions';
import TooltipAnchors from './TooltipAnchors';

export default class TooltipRenderer {

  static defaultOptions = {
    className: 'tooltip',
    position: TooltipPositions.topLeft,
    anchor: TooltipAnchors.path,
    mousePadding: 10,
  };

  constructor (ownerComponent, options) {
    this.ownerComponent = ownerComponent;
    this.options = {
      ...this.constructor.defaultOptions,
      ...options,
    };
    this.onShow = curryThisElement(this.onShow, this);
    this.onMove = curryThisElement(this.onMove, this);
    this.onHide = curryThisElement(this.onHide, this);
  }

  bind = (selection) => {
    this.svg = this.getSVGNode(selection);
  }

  getContainer () {
    if (!this.container) {
      this.container = window.document.createElement('div');
      this.container.className = this.options.className;
    }
    return this.container;
  }

  getSVGNode (selection) {
    const svgNode = selection.node();
    if (svgNode) {
      if (svgNode.tagName.toUpperCase() === 'SVG') {
        return svgNode;
      }
      return svgNode.ownerSVGElement;
    }
    return undefined;
  }

  onShow (eventElement, data, i) {
    if (!eventElement || !data) {
      return;
    }
    const container = this.getContainer();
    if (!container.parentNode) {
      window.document.body.appendChild(container);
    }
    const tooltipElement = React.cloneElement(this.component, {
      options: this.options,
      ...this.ownerComponent.props,
      ...this.component.props,
      data,
      i,
    });
    if (tooltipElement) {
      ReactDOM.render(tooltipElement, container);
      const position = this.component.props.position || this.options.position;
      let anchor = this.component.props.anchor || this.options.anchor;
      if (this.ownerComponent.props.displayItem) {
        // I'm being forced to show tooltip
        anchor = TooltipAnchors.path;
      }
      const anchorRect = this.getAnchorRect(anchor, eventElement);
      tooltipPositioner(position, anchorRect, container, this.options);
    } else {
      const name = this.component.displayName || this.component.name;
      /* eslint-disable no-console */
      console.warn(`${name} didn't return a valid tooltip, so skipping.`);
    }
  }

  onMove (eventElement) {
    const anchor = this.component.props.anchor || this.options.anchor;
    if (anchor !== TooltipAnchors.mouse) {
      return;
    }
    const position = this.component.props.position || this.options.position;
    const container = this.getContainer();
    if (!container.parentNode) {
      return;
    }
    const anchorRect = this.getAnchorRect(anchor, eventElement);
    tooltipPositioner(position, anchorRect, container, this.options);
  }

  onHide () {
    if (this.container && this.container.parentNode) {
      window.document.body.removeChild(this.container);
    }
  }

  update (component, options = {}) {
    this.component = component;
    this.options = {
      ...this.constructor.defaultOptions,
      ...options,
    };
  }

  getAnchorRect (anchor, eventElement) {
    if (anchor === TooltipAnchors.mouse) {
      return this.generateMouseRect(eventElement);
    }
    let element = eventElement;
    if (anchor === TooltipAnchors.chart) {
      element = this.svg;
    }
    return element.getBoundingClientRect();
  }

  generateMouseRect (eventElement) {
    let [x, y] = mouse(this.svg || eventElement);
    const padding = this.options.mousePadding;
    const svg = this.svg.getBoundingClientRect();
    x += svg.left;
    y += svg.top;
    return {
      left: x - padding,
      top: y - padding,
      bottom: y + padding,
      right: y + padding,
      width: (padding * 2),
      height: (padding * 2),
    };
  }

}
