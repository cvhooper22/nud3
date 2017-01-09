import React from 'react';
import { Link } from 'react-router';
import ComponentsList from './ComponentsList';

export default function DocumentationLayout (props) {
  return (
    <div className="documentation-layout">
      <div className="documentation-layout__sidebar">
        <Link to="/">
          <h1>nud3</h1>
        </Link>
        <ul>
          { ComponentsList.map(c => <li key={ c }><Link to={ `/${c}` }>{ c }</Link></li>) }
        </ul>
        <a href="https://travis-ci.org/inlineblock/nud3" target="_blank" rel="noopener noreferrer">
          <img src="https://travis-ci.org/inlineblock/nud3.svg?branch=master" role="presentation" />
        </a>
        <div className="social-links">
          <a href="https://github.com/inlineblock/nud3" target="_blank" rel="noopener noreferrer">
            <i className="fa fa-github" />
          </a>
          <a href="https://twitter.com/inline_block/" target="_blank" rel="noopener noreferrer">
            <i className="fa fa-twitter" />
          </a>
        </div>
      </div>
      <div className="documentation-layout__content">
        { props.children }
      </div>
    </div>
  );
}

DocumentationLayout.propTypes = {
  children: React.PropTypes.node,
};
