import React, { Component } from 'react';
import {
  ROW,
  COL
} from '../constants/BlenderLayoutConstants';

function dividerStyle({layout, pane}) {
  const {parentId} = pane;
  const parent = layout.panes.get(parentId);
  const {direction} = parent;
  const {dividerWidth} = layout;

  var style = {
    backgroundColor: '#a0f'
  };

  if (direction === ROW) {
    style.width = dividerWidth + 'px';
  }
  if (direction === COL) {
    style.height = dividerWidth + 'px';
  }

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
      <div style={dividerStyle(this.props)} />
    );
  }
}
