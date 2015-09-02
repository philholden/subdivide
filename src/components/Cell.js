import React, { Component } from 'react';
import Radium from 'radium';
import {
  ROW,
  COL,
  CHILD_ABOVE,
  CHILD_BELOW,
  CHILD_LEFT,
  CHILD_RIGHT,
  SPLIT_JOIN_MODE
} from '../../src/constants/BlenderLayoutConstants';
import Divider from './Divider';
import {canJoin} from '../helpers/Metrics';



function cellStyles({
      width,
      height,
      contentWidth,
      contentHeight
    }) {
  let paneStyle = {
    float: 'left',
    width: width + 'px',
    height: height + 'px',
    position: 'relative'
    // ':hover': {
    //   backgroundColor: 'rgba(0,0,0,0.1)'
    // }
  };

  let contentStyle = {
    float: 'left',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#xxx'.replace(/x/g, () => ((Math.random() * 16) | 0).toString(16)),
    width: contentWidth + 'px',
    height: contentHeight + 'px'
  };

  return {paneStyle, contentStyle};
}

@Radium
export default class Cell extends Component {
  constructor(props, context) {
    super(props, context);

    this.onMouseMove = (e) => {
      const {clientX, clientY} = e;
      const {layout, pane, actions} = this.props;
      const {mode, splitJoinId, splitStartX, splitStartY} = layout;
      const {setMode, split} = actions;
      if (mode === SPLIT_JOIN_MODE) {
        if (splitJoinId === pane.id) {
          let deltaX = clientX - splitStartX;
          let deltaY = clientY - splitStartY;
          console.log('split', splitJoinId, deltaX, deltaY);
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
        }
        e.stopPropagation();
      }
    };

    this.onMouseUp = (e) => {
      console.log('mouseup');
      const {clientX, clientY} = e;
      const {layout, pane, actions} = this.props;
      const {mode, splitJoinId, splitStartX, splitStartY} = layout;
      const {setMode, split} = actions;
      if (mode === SPLIT_JOIN_MODE) {
        console.log('can join', canJoin(this.props, splitJoinId));
        setMode(undefined, undefined, undefined, undefined);
        e.stopPropagation();
      //  actions.join(splitJoinId, pane.id);
      }
    }
  }



  shouldDisplayDivider() {
    const {pane, layout} = this.props;
    if (layout.rootId === pane.id) return false;
    const {id, parentId} = pane;
    const parent = layout.panes.get(parentId);
    const siblings = parent.childIds;
    const isFirst = siblings.first() === id;
    return !isFirst;
  }

  render() {
    const {pane, layout, sizes, actions} = this.props;
    const {paneStyle, contentStyle} = cellStyles(sizes);
    return (
      <div style={paneStyle} className="pane" onMouseMove={this.onMouseMove} onMouseUp={this.onMouseUp}>
        <Divider
          pane={pane}
          layout={layout}
          sizes={sizes}
          actions={actions}
          />
        <div style={contentStyle} className="contents">
          {this.props.children}
        </div>
      </div>
    );
  }
}
