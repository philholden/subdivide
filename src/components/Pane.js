import React, { Component } from 'react';
import Triangle from './Triangle';

import {
  NE,
  SW,
  CHILD_ABOVE,
  CHILD_BELOW,
  CHILD_LEFT,
  CHILD_RIGHT,
  SPLIT_JOIN_MODE
} from '../constants/BlenderLayoutConstants';

function getStyles({
      width,
      height,
      top,
      left
    }) {
  let pane = {
    position: 'absolute',
    width: width + 'px',
    height: height + 'px',
    top: top + 'px',
    left: left + 'px',
    overflow: 'hidden',
    backgroundColor: '#xxx'.replace(/x/g, () => ((Math.random() * 16) | 0).toString(16)),
    // ':hover': {
    //   backgroundColor: 'rgba(0,0,0,0.1)'
    // }
  };

  return {pane};
}

export default class Pane extends Component {
  constructor(props, context) {
    super(props, context);

    this.onMouseMove = (e) => {
      const {clientX, clientY} = e;
      const {layout, pane, actions} = this.props;
      const {mode, splitJoinId, splitStartX, splitStartY} = layout;
      const {setMode, split, setBlock} = actions;
      if (mode === SPLIT_JOIN_MODE) {
        if (splitJoinId === pane.id) {
          let deltaX = clientX - splitStartX;
          let deltaY = clientY - splitStartY;
          if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > 0) {
              split(pane.id, CHILD_LEFT);
            } else {
              split(pane.id, CHILD_RIGHT);
            }
          } else {
            if (deltaY > 0) {
              split(pane.id, CHILD_ABOVE);
            } else {
              split(pane.id, CHILD_BELOW);
            }
          }
          setMode(undefined, undefined, undefined, undefined);
          setBlock(false);
        }
        e.stopPropagation();
      }
    };

    this.onMouseUp = (e) => {
      const {layout, pane, actions} = this.props;
      const {mode, splitJoinId} = layout;
      const {setMode, setBlock} = actions;
      if (mode === SPLIT_JOIN_MODE) {
        setMode(undefined, undefined, undefined, undefined);
        setBlock(false);
        e.stopPropagation();
        actions.join(splitJoinId, pane.id);
      }
    };
  }


        // <iframe src="index2.html" frameBorder={'0'} style={{
        //   width: '100%',
        //   height: '100%'
        // }}></iframe>
    //{pane.id} {pane.splitRatio} {sizes.contentWidth} {sizes.width}



  render() {
    const {pane, layout, actions} = this.props;
    const styles = getStyles(pane);

    return (
      <div style={styles.pane} onMouseMove={this.onMouseMove} onMouseUp={this.onMouseUp}>
        <div style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,200,0,0)',
          position: 'absolute',
          top: 0,
          display: layout.displayBlock ? 'block' : 'none'
        }}></div>
        <Triangle
          corner={SW}
          color='#444'
          size={40}
          layout={layout}
          pane={pane}
          actions={actions}
        />
        <Triangle
          corner={NE}
          color='#444'
          size={40}
          layout={layout}
          pane={pane}
          actions={actions}
        />
        {`id:${pane.id} pos: (${pane.width}, ${pane.height})`}
      </div>
    );
  }
}
