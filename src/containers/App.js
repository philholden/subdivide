import React, { Component } from 'react';
import Pane from '../components/Pane';

export default class App extends Component {
  render() {
    return (
      <div>
        <div style={{
          width: 55 / Math.sqrt(2) + 'px',
          height: 55 / Math.sqrt(2) + 'px',
          position: 'absolute',
          top: 0,
          right: 0,
          backgroundColor: 'blue'
        }}></div>
        <div style={{
          width: 55 / Math.sqrt(2) + 'px',
          height: 55 / Math.sqrt(2) + 'px',
          position: 'absolute',
          bottom: 0,
          left: 0,
          backgroundColor: 'blue'
        }}></div>
        <Pane />
      </div>
    );
  }
}
