import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Subdivide from './index';

class IframeComponent extends Component {
  render() {
    return (
      <iframe src="index2.html" frameBorder={'0'} style={{
         width: '100%',
         height: '100%'
      }} />
    );
  }
}

ReactDOM.render(
  <Subdivide DefaultComponent={IframeComponent} />,
  document.getElementById('root')
);

