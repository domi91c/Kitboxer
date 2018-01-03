import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { TrixEditor } from 'react-trix';

const TutorialEditor = props => (
    <div className="container mt-5">
      <div className="card-body clearfix">
        <h1>Tutorial Editor</h1>
        <hr/>
        <div className="box mt-4">
          <div className="card-body"><h2> Step 1</h2>
            <hr/>
            <input type="text" placeholder="Enter step title..."
                   className="form-control mb-4"/>
            <TrixEditor className="form-control" onChange={this.handleChange}
                        onEditorReady={this.handleReady}/></div>
        </div>
        <div className="box mt-4">
          <div className="card-body"><h2> Step 2</h2>
            <hr/>
            <input type="text" placeholder="Enter step title..."
                   className="form-control mb-4"/>
            <TrixEditor onChange={this.handleChange}
                        onEditorReady={this.handleReady}/></div>
        </div>
      </div>
    </div>
);

TutorialEditor.defaultProps = {
  name: 'David',
};

TutorialEditor.propTypes = {
  name: PropTypes.string,
};

document.addEventListener('DOMContentLoaded', () => {
  let el = document.querySelector('.js-tutorial-editor--react');
  ReactDOM.render(
      <TutorialEditor/>,
      el.appendChild(document.createElement('div')),
  );
});
