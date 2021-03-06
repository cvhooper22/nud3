import React from 'react';

export default function DocumentTitle (props) {
  window.document.title = props.title;
  return null;
}

DocumentTitle.propTypes = {
  title: React.PropTypes.string.isRequired,
};
