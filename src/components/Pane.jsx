import React, { Component } from 'react';
import Triangle from './Triangle.jsx';
import CornerOverlay from './CornerOverlay.jsx';

import { cardinals } from '../reducers';

function getStyles({
  width,
  height,
  top,
  left
}) {
  return {
    pane: {
      position: 'absolute',
      width: width + 'px',
      height: height + 'px',
      top: top + 'px',
      left: left + 'px',
      overflow: 'hidden'
    }
  };
}

export default class Pane extends Component {
  constructor(props, context) {
    super(props, context);

    this.onMouseUp = () => {
      // Note this on mouse up happens after Subdivide on mouse up
      const { actions, subdivide, pane } = this.props;
      const { join } = actions;
      if (!subdivide.cornerDown) {
        return null;
      }
      const cornerDownId = subdivide.cornerDown.id;
      if (pane.joinDirection) {
        join(cornerDownId, pane.id);
        actions.setCornerDown();
      }
      return null;
    };
  }

  render() {

    if (!this.props.pane) {
      return <div style={{ visibility: 'hidden' }} />;
    }

    if (this.props.pane.isGroup) {
      return null;
    }

    const { pane, subdivide, actions, DefaultComponent } = this.props;
    const styles = getStyles(pane);

    return (
      <div
        onMouseMove={ this.onMouseMove }
        onMouseUp={ this.onMouseUp }
        style={ styles.pane }
        >
        <DefaultComponent
          subdivide={ subdivide }
          subdivideActions={ actions }
          subdividePane={ pane }
        />
        <CornerOverlay
          pane={ pane }
          subdivide={ subdivide }
        />
        <Triangle
          actions={ actions }
          color='#dadadf'
          corner={ cardinals.sw }
          pane={ pane }
          size={ 42 }
          subdivide={ subdivide }
        />
        <Triangle
          actions={ actions }
          color='#dadadf'
          corner={ cardinals.ne }
          pane={ pane }
          size={ 42 }
          subdivide={ subdivide }
        />
        <Triangle
          actions={ actions }
          color='#dadadf'
          corner={ cardinals.nw }
          pane={ pane }
          size={ 42 }
          subdivide={ subdivide }
        />
        <Triangle
          actions={ actions }
          color='#dadadf'
          corner={ cardinals.se }
          pane={ pane }
          size={ 42 }
          subdivide={ subdivide }
        />
      </div>
    );
  }
}

