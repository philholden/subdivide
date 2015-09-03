import React, { Component } from 'react';
import Pane from './Pane';
import {getSizes} from '../helpers/Metrics';
import {flatten} from '../helpers/LayoutHelper';

export default class Layout extends Component {
  constructor(props, context) {
    super(props, context);
    const {setSize} = props.actions;
    window.addEventListener('resize', () => {
      setSize(window.innerWidth, window.innerHeight);
    });
    setSize(window.innerWidth, window.innerHeight);
  }
  render() {
    const {layout, setSize, actions} = this.props;
    const {width, height} = layout;
    const pane = layout.panes.get(layout.rootId);
    const sizes = getSizes({layout, pane}, width, height);
    console.log(flatten(layout, layout.rootId, {width, height}));
    return (
      <Pane
        layout={layout}
        pane={pane}
        sizes={sizes}
        actions={actions}
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
