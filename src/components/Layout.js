import React, { Component } from 'react';
import Pane from './Pane';
import {getSizes} from '../helpers/Metrics';

export default class Layout extends Component {
  render() {
    const {layout} = this.props;
    const {width, height} = layout;
    console.log(layout.toJS());
    const pane = layout.panes.get(layout.rootId);
    const sizes = getSizes({layout, pane}, width, height);
    console.log(sizes);
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
