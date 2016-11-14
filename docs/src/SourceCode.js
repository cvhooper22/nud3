function requireAll (requireContext) {
  const source = {};
  requireContext.keys().forEach((key) => {
    source[key.substr(2)] = requireContext(key);
  });
  return source;
}
export default requireAll(require.context('!!raw!./visualizations', true, /^\.\/.*\.js/));
