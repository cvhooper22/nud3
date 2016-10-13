import React from 'react';
import ReactDOM from 'react-dom';
import curryThisElement from './curryThisElement';

export default class TooltipRenderer {

  static topLeft = 0;
  static topCenter = 1;
  static topRight = 2;
  static middleLeft = 3;
  static middleCenter = 4;
  static middleRight = 5;
  static bottomLeft = 6;
  static bottomCenter = 7;
  static bottomRight = 8;

  static defaultOptions = {
    className: 'tooltip',
    location: 1,
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

  onShow (el, data, i) {
    if (!el || !data) {
      return;
    }
    const container = this.getContainer();
    if (!container.parentNode) {
      window.document.body.appendChild(container);
    }
    const Component = this.component;
    ReactDOM.render((
      <Component data={ data } i={ i } options={ this.options } />
    ), container);

    const style = this.getLocationOffset(el, container);
    container.style.left = `${style.left}px`;
    container.style.top = `${style.top}px`;
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

  getLocationOffset (element, tooltip) {
    const clientRectElement = element.getBoundingClientRect();
    const clientRectTooltip = tooltip.getBoundingClientRect();
    const elementLeft = clientRectElement.left + window.scrollX;
    const elementTop = clientRectElement.top + window.scrollY;
    const leftAnchored = (this.options.location % 3) === 0;
    const rightAnchored = (this.options.location % 3) === 2;
    const topAnchored = this.options.location < 3;
    const bottomAnchored = this.options.location > 5;
    const offset = {};
    if (leftAnchored) {
      offset.left = elementLeft - clientRectTooltip.width;
    } else if (rightAnchored) {
      offset.left = elementLeft + clientRectElement.width;
    } else {
      offset.left = elementLeft + ((clientRectElement.width / 2) - (clientRectTooltip.width / 2));
    }
    if (topAnchored) {
      offset.top = elementTop - clientRectTooltip.height;
    } else if (bottomAnchored) {
      offset.top = elementTop + clientRectElement.height;
    } else {
      offset.top = elementTop + ((clientRectElement.height / 2) - (clientRectTooltip.height / 2));
    }
    if (this.options.offsetTop) {
      offset.top += this.options.offsetTop;
    }
    if (this.options.offsetLeft) {
      offset.left += this.options.offsetLeft;
    }
    return offset;
  }

}
