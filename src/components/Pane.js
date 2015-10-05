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
      //Note this on mouse up happens after layout on mouse up
      const {actions, layout, pane} = this.props;
      const {join} = actions;
      if (!layout.cornerDown) return;
      const cornerDownId = layout.cornerDown.id;
      if(pane.joinDirection) {
        join(cornerDownId, pane.id);
        actions.setCornerDown(undefined);
      }
    };
  }

  render() {
    const {pane, layout, actions, DefaultComponent} = this.props;
    const styles = getStyles(pane);

    return (
      <div style={styles.pane} onMouseMove={this.onMouseMove} onMouseUp={this.onMouseUp}>
        <DefaultComponent {...pane.props} subdivdeActions={actions} subdivide={layout} />
        <CornerOverlay pane={pane} layout={layout} />
        <Triangle
          corner={SW}
          color='#dadadf'
          size={42}
          layout={layout}
          pane={pane}
          actions={actions}
        />
        <Triangle
          corner={NE}
          color='#dadadf'
          size={42}
          layout={layout}
          pane={pane}
          actions={actions}
        />
        <Triangle
          corner={NW}
          color='#dadadf'
          size={42}
          layout={layout}
          pane={pane}
          actions={actions}
        />
        <Triangle
          corner={SE}
          color='#dadadf'
          size={42}
          layout={layout}
          pane={pane}
          actions={actions}
        />
      </div>
    );
  }
}
