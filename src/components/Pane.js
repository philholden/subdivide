import React, { Component } from 'react';
import Triangle from './Triangle';

import {
  NE,
  SW
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
    overflow: 'hidden',
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
        //e.stopPropagation();
        join(cornerDownId, pane.id);
        actions.setCornerDown(undefined);
      }
    };
  }



    //{pane.id} {pane.splitRatio} {sizes.contentWidth} {sizes.width}



  render() {
    const {pane, layout, actions} = this.props;
    const styles = getStyles(pane);
    const isJoinable = isJoinPossible(this.props);
        // {isJoinPossible(this.props) ? 'true' : 'false'}
        // {JSON.stringify(pane.childIds)}
        // {pane.id}

    return (
      <div style={styles.pane} onMouseMove={this.onMouseMove} onMouseUp={this.onMouseUp}>
        <iframe src="index2.html" frameBorder={'0'} style={{
           width: '100%',
           height: '100%'
        }}></iframe>
        <div style={{
          width: '100%',
          height: '100%',
          backgroundColor: !isJoinable ? 'rgba(0,200,0,0.5)' : 'rgba(0,0,0,0.5)',
          position: 'absolute',
          top: 0,
          display: layout.cornerDown || layout.dividerDown ? 'block' : 'none'
        }}>
        </div>
        <Triangle
          corner={SW}
          color='rgba(127,127,127,0.5)'
          size={40}
          layout={layout}
          pane={pane}
          actions={actions}
        />
        <Triangle
          corner={NE}
          color='rgba(127,127,127,0.5)'
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
