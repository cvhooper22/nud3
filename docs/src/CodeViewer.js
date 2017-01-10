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
        <pre>{ this.renderCode() }</pre>
      </div>
    );
  }

  renderCode () {
    return (
      <code
        className="language-jsx line-numbers"
        dangerouslySetInnerHTML={{ __html: this.getSource() }}
        ref={ n => n && Prism.highlightElement(n) }
      />
    );
  }

}

CodeViewer.propTypes = {
  code: React.PropTypes.string,
  filename: React.PropTypes.string.isRequired,
};
