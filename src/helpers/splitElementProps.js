export default DOMPropertyConfig => (props) => {
  const newProps = { ...props };
  delete newProps.children;
  const keys = Object.keys(newProps);
  const elementProps = {};
  keys.forEach((name) => {
    if (DOMPropertyConfig.Properties.hasOwnProperty(name)) {
      elementProps[name] = newProps[name];
      delete newProps[name];
    }
  });
  return [elementProps, newProps];
};
