import React, { Component } from 'react';
import {
  ROW,
  COL
} from '../constants/BlenderLayoutConstants';

import {getAdjacent} from '../constants/BlenderLayoutConstants';

function dividerStyle({dividerWidth, dividerHeight, direction}) {

  var style = {
    width: dividerWidth + 'px',
    height: dividerHeight + 'px',
    backgroundColor: '#a0f',
    float: 'left',
    cursor: direction === COL ? 'ns-resize' : 'ew-resize'
  };

  return style;
}

function shouldDisplay({layout, pane}) {
  if (layout.rootId === pane.id) return false;
  const {id, parentId} = pane;
  const parent = layout.panes.get(parentId);
  const siblings = parent.childIds;
  const isFirst = siblings.first() === id;
  return !isFirst;
}

export default class Divider extends Component {
  constructor(props, context) {
    super(props, context);

    this.onMouseMove = ({clientX, clientY}) => {
      let {x, y} = this.start;
      let delta = {x: clientX - x, y: clientY - y};
      //

    };

    this.removeListeners = () => {
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);
    };

    this.onMouseUp = () => {
      this.removeListeners();
    };

    this.onMouseDown = ({clientX, clientY}) => {
      this.start = {x: clientX, y: clientY};
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
    };
  }



  componentWillUnmount() {
    this.removeListeners();
  }

  render() {
    if (!shouldDisplay(this.props)) return null;

    return (
      <div
        style={dividerStyle(this.props.sizes)}
        onMouseDown={this.onMouseDown}
        className="divider" />
    );
  }
}
