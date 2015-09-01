import React, { Component } from 'react';
import Pane from './Pane';
import {getSizes} from '../helpers/Metrics';

export default class Layout extends Component {
  constructor(props, context) {
    super(props, context);
    window.addEventListener('resize', () => {
      props.setSize(window.innerWidth, window.innerHeight);
    });
  }
  render() {
    const {layout, setSize} = this.props;
    const {width, height} = layout;
    const pane = layout.panes.get(layout.rootId);
    const sizes = getSizes({layout, pane}, width, height);
    return (
      <Pane
        layout={layout}
        pane={pane}
        sizes={sizes}
      />
    );
  }
}

// <div style={{
//           width: 55 / Math.sqrt(2) + 'px',
//           height: 55 / Math.sqrt(2) + 'px',
//           position: 'absolute',
//           top: 0,
//           right: 0,
//           backgroundColor: 'blue'
//         }}></div>
//         <div style={{
//           width: 55 / Math.sqrt(2) + 'px',
//           height: 55 / Math.sqrt(2) + 'px',
//           position: 'absolute',
//           bottom: 0,
//           left: 0,
//           backgroundColor: 'blue'
//         }}></div>
