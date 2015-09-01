import React, { Component } from 'react';
import {
  ROW,
  COL
} from '../constants/BlenderLayoutConstants';

function dividerStyle({width, height, direction}) {

  var style = {
    width: width + 'px',
    height: height + 'px',
    backgroundColor: '#a0f',
    float: 'left'
  };

  // if (direction === ROW) {
  //   float: 'left'
  // }
  // if (direction === COL) {
  //   style.height = dividerWidth + 'px';
  // }

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
  }

  render() {
    if (!shouldDisplay(this.props)) return null;

    return (
      <div style={dividerStyle(this.props)} className="divider" />
    );
  }
}
