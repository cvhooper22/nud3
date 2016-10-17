function getPositionOffset (position, anchorElement, tooltipElement, options = {}) {
  const clientRectElement = anchorElement.getBoundingClientRect();
  const clientRectTooltip = tooltipElement.getBoundingClientRect();
  const elementLeft = clientRectElement.left + window.scrollX;
  const elementTop = clientRectElement.top + window.scrollY;
  const leftAnchored = (position % 3) === 0;
  const rightAnchored = (position % 3) === 2;
  const topAnchored = position < 3;
  const bottomAnchored = position > 5;
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
  if (options.offsetTop) {
    offset.top += options.offsetTop;
  }
  if (options.offsetLeft) {
    offset.left += options.offsetLeft;
  }
  return offset;
}

export default function tooltipPositioner (position, anchorElement, tooltipElement, options = {}) {
  const style = getPositionOffset(position, anchorElement, tooltipElement, options);
  tooltipElement.style.left = `${style.left}px`;
  tooltipElement.style.top = `${style.top}px`;
}
