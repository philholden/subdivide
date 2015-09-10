import React, { Component } from 'react';
import Triangle from './Triangle';

import {
  NE,
  SW,
  ROW
} from '../constants/BlenderLayoutConstants';
import {
  isJoinPossible
} from '../helpers/LayoutHelper';

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
    overflow: 'hidden'
    //backgroundColor: '#xxx'.replace(/x/g, () => (((Math.random() * 6) + 10) | 0).toString(16))
  };

  return {pane};
}

export default class Pane extends Component {
  constructor(props, context) {
    super(props, context);

    this.onMouseUp = () => {
      //Note this on mouse up happens after layout on mouse up
      const {actions, layout, pane} = this.props;
      const {join} = actions;
      if (!layout.cornerDown) return;
      const cornerDownId = layout.cornerDown.id;
      if(isJoinPossible(this.props)) {
        join(cornerDownId, pane.id);
        actions.setCornerDown(undefined);
      }
    };
  }

  render() {
    const {pane, layout, actions} = this.props;
    const styles = getStyles(pane);
    const isJoinable = isJoinPossible(this.props);
    const {dividerDown} = layout;
    const cursor = !dividerDown ? undefined :
      dividerDown.direction === ROW ?
        'col-resize' :
        'row-resize';

    return (
      <div style={styles.pane} onMouseMove={this.onMouseMove} onMouseUp={this.onMouseUp}>
        <iframe src="index2.html" frameBorder={'0'} style={{
           width: '100%',
           height: '100%'
        }}></iframe>
        <div style={{
          width: '100%',
          height: '100%',
          backgroundColor: !isJoinable ? 'rgba(0,200,0,0)' : 'rgba(0,0,0,0.5)',
          position: 'absolute',
          cursor: cursor,
          top: 0,
          display: layout.cornerDown || layout.dividerDown ? 'block' : 'none'
        }}>
        </div>
        <Triangle
          corner={SW}
          color='#dadadf'
          size={40}
          layout={layout}
          pane={pane}
          actions={actions}
        />
        <Triangle
          corner={NE}
          color='#dadadf'
          size={40}
          layout={layout}
          pane={pane}
          actions={actions}
        />
      </div>
    );
  }
}
//{`id:${pane.id} pos: (${pane.width}, ${pane.height})`}
