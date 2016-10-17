import React from 'react';
import ReactDOM from 'react-dom';
import curryThisElement from './curryThisElement';
import tooltipPositioner from './tooltipPositioner';
import TooltipPositions from './TooltipPositions';

export default class TooltipRenderer {

  static defaultOptions = {
    className: 'tooltip',
    position: TooltipPositions.topLeft,
    offsetTop: 0,
    offsetLeft: 0,
  };

  constructor (component, options) {
    this.options = {
      ...this.constructor.defaultOptions,
      ...options,
    };
    this.component = component;
    this.onShow = curryThisElement(this.onShow, this);
    this.onHide = curryThisElement(this.onHide, this);
    this.bind = ::this.bind;
  }

  bind (selection) {
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

  onShow (anchorElement, data, i) {
    if (!anchorElement || !data) {
      return;
    }
    const container = this.getContainer();
    if (!container.parentNode) {
      window.document.body.appendChild(container);
    }
    ReactDOM.render(React.cloneElement(
      this.component, {
        options: this.options,
        ...this.component.props,
        data,
        i,
      }
    ), container);

    tooltipPositioner(this.component.props.position || this.options.position, anchorElement, container, this.options);
  }

  onHide () {
    if (this.container.parentNode) {
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

}
