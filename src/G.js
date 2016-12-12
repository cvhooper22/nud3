import React from 'react';
import splitSVGElementProps from './helpers/splitSVGElementProps';

export default function G (props) {
  const [elementProps, newProps] = splitSVGElementProps(props);

  const children = React.Children.map(props.children, (node) => {
    return React.cloneElement(node, { ...newProps, ...node.props });
  });

  return (
    <g { ...elementProps }>
      { children }
    </g>
  );
}
G.propTypes = {
  children: React.PropTypes.node,
};
