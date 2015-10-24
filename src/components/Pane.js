import React, { Component } from 'react';
import Triangle from './Triangle';
import CornerOverlay from './CornerOverlay';

import {
  NE,
  SW,
  SE,
  NW
} from '../constants';

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
  };

  return {pane};
}

export default class Pane extends Component {
  constructor(props, context) {
    super(props, context);

    this.onMouseUp = () => {
      //Note this on mouse up happens after subdivide on mouse up
      const {actions, subdivide, pane} = this.props;
      const {join} = actions;
      if (!subdivide.cornerDown) return;
      const cornerDownId = subdivide.cornerDown.id;
      if(pane.joinDirection) {
        join(cornerDownId, pane.id);
        actions.setCornerDown(undefined);
      }
    };
  }

  render() {
    const {pane, subdivide, actions, DefaultComponent} = this.props;
    const styles = getStyles(pane);

    return (
      <div style={styles.pane} onMouseMove={this.onMouseMove} onMouseUp={this.onMouseUp}>
        <DefaultComponent
          subdividePane={pane}
          subdivideActions={actions}
          subdivide={subdivide} />
        <CornerOverlay pane={pane} subdivide={subdivide} />
        <Triangle
          corner={SW}
          color='#dadadf'
          size={42}
          subdivide={subdivide}
          pane={pane}
          actions={actions}
        />
        <Triangle
          corner={NE}
          color='#dadadf'
          size={42}
          subdivide={subdivide}
          pane={pane}
          actions={actions}
        />
        <Triangle
          corner={NW}
          color='#dadadf'
          size={42}
          subdivide={subdivide}
          pane={pane}
          actions={actions}
        />
        <Triangle
          corner={SE}
          color='#dadadf'
          size={42}
          subdivide={subdivide}
          pane={pane}
          actions={actions}
        />
      </div>
    );
  }
}



