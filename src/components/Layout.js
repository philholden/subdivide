import React, { Component } from 'react';
import Pane from './Pane';

export default class Layout extends Component {
  render() {
    const {layout} = this.props;
    //console.log(layout.toJS());
    const pane = layout.panes.get(layout.rootId);
    return (
      <Pane layout={layout} pane={pane} />
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
