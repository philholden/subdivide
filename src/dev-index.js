//import 'babel-core/polyfill';
import React, {Component} from 'react';
import ReactDom from 'react-dom';
import Subdivide from './containers/Subdivide';

class IframeComponent extends Component {
  render() {
    return (
      <iframe src="index2.html" frameBorder={'0'} style={{
         width: '100%',
         height: '100%'
      }}></iframe>
    );
  }
}

ReactDom.render(<Subdivide DefaultComponent={IframeComponent}/>, document.getElementById('root'));

