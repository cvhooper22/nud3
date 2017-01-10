import React from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx.min';
import 'prismjs/plugins/line-numbers/prism-line-numbers';
import SourceCode from './SourceCode';


export default class CodeViewer extends React.Component {

  getSource () {
    if (this.props.code) {
      return this.props.code.toString();
    }
    return SourceCode[this.props.filename];
  }

  render () {
    return (
      <div className="code-viewer">
        <h4>{ this.props.filename }</h4>
        <pre
          className="language-jsx line-numbers"
        >
          { this.renderCode() }
        </pre>
      </div>
    );
  }

  renderCode () {
    const source = this.getSource();
    return (
      <code
        className="line-numbers"
        ref={ n => n && (n.innerHTML = Prism.highlight(source, Prism.languages.jsx)) }
      />
    );
  }

}

CodeViewer.propTypes = {
  code: React.PropTypes.string,
  filename: React.PropTypes.string.isRequired,
};
