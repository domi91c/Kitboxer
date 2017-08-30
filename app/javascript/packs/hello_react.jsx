// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import ReactImageCrop from 'react-image-crop-component';
import 'react-image-crop-component/lib/style.css';

const Hello = props => (
    <div>
      <div style={{ width: '300px', height: '300px' }}>
        <ReactImageCrop src="https://www.picmonkey.com/_/static/images/index/picmonkey_twitter_02.24fd38f81e59.jpg"
                        setWidth={300}
                        setHeight={300}
                        square={false}
                        resize={true}
                        border={'dashed #ffffff 2px'}
                        />
      </div>
    </div>
);

Hello.defaultProps = {
  name: 'David',
};

Hello.propTypes = {
  name: PropTypes.string,
};

document.addEventListener('DOMContentLoaded', () => {
  let helloEl = document.querySelector('#hello_react');
  ReactDOM.render(
      <Hello
          imageSrc="http://react.rocks/images/converted/react-avatar-editor.jpg"/>,
      helloEl.appendChild(document.createElement('div')),
  );
});
