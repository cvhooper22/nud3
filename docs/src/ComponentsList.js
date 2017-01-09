const list = require.context('!!raw!../src/views/visualizations/', false, /^\.\/.*\.js/).keys();
const ComponentsList = list.map((name) => {
  return name.substr(2, name.length - 9);
});
ComponentsList.sort();

export default ComponentsList;
