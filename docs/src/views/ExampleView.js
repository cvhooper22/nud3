import React from 'react';
import CodeViewer from '../CodeViewer';
import DocumentTitle from '../DocumentTitle';

function requireAll (requireContext) {
  const source = {};
  requireContext.keys().forEach((key) => {
    source[key.substr(2, key.length - 9)] = requireContext(key);
  });
  return source;
}
const VisualizationComponents = requireAll(require.context('../views/visualizations', true, /^\.\/.*\.js/));
console.log(VisualizationComponents);

export default function Example (props) {
  const name = props.params.name;
  const Component = VisualizationComponents[name];
  return (
    <div>
      <DocumentTitle title={ `${name} Nud3 Example` } />
      <h1>{ name }</h1>
      <Component.default />
      <CodeViewer filename={ `${name}.js` } />
    </div>
  );
}

Example.propTypes = {
  params: React.PropTypes.object.isRequired,
};
