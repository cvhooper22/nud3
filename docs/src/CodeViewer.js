import React from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx.min';
import 'prismjs/plugins/line-numbers/prism-line-numbers';


export default class CodeViewer extends React.Component {
  render () {
    return (
      <div className="code-viewer">
        <h4>{ this.props.filename }</h4>
        <pre>{ this.renderCode() }</pre>
      </div>
    );
  }

  renderCode () {
    return (
      <code
        className="language-jsx code-viewer__syntax line-numbers"
        dangerouslySetInnerHTML={{ __html: Prism.highlight(this.props.code, Prism.languages.jsx) || '' }}
      />
    );
  }

}

CodeViewer.propTypes = {
  code: React.PropTypes.string.isRequired,
  filename: React.PropTypes.string.isRequired,
};
