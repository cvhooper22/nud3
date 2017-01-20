function getPositionOffset (position, anchorRect, tooltipRect, options = {}) {
  const elementLeft = anchorRect.left + window.scrollX;
  const elementTop = anchorRect.top + window.scrollY;
  const leftAnchored = (position % 3) === 0;
  const rightAnchored = (position % 3) === 2;
  const topAnchored = position < 3;
  const bottomAnchored = position > 5;
  const offset = {};
  if (leftAnchored) {
    offset.left = elementLeft - tooltipRect.width;
  } else if (rightAnchored) {
    offset.left = elementLeft + anchorRect.width;
  } else {
    offset.left = elementLeft + ((anchorRect.width / 2) - (tooltipRect.width / 2));
  }
  if (topAnchored) {
    offset.top = elementTop - tooltipRect.height;
  } else if (bottomAnchored) {
    offset.top = elementTop + anchorRect.height;
  } else {
    offset.top = elementTop + ((anchorRect.height / 2) - (tooltipRect.height / 2));
  }
  if (options.offsetTop) {
    offset.top += options.offsetTop;
  }
  if (options.offsetLeft) {
    offset.left += options.offsetLeft;
  }
  return offset;
}

export default function tooltipPositioner (position, anchorRect, tooltipElement, options = {}) {
  const tooltipRect = tooltipElement.getBoundingClientRect();
  const style = getPositionOffset(position, anchorRect, tooltipRect, options);
  tooltipElement.style.left = `${style.left}px`;
  tooltipElement.style.top = `${style.top}px`;
}
