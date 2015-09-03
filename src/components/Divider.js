import React, { Component } from 'react';
import {
  ROW,
  COL
} from '../constants/BlenderLayoutConstants';

import {getAdjacent} from '../helpers/Metrics';

function dividerStyle({dividerWidth, dividerHeight, direction}) {

  var style = {
    width: dividerWidth + 'px',
    height: dividerHeight + 'px',
    backgroundColor: '#333',
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
      const {sizes, actions, pane} = this.props;
      const adjacent = getAdjacent(this.props);
      const {direction, adjacentSize} = sizes;
      let {x, y} = this.start;
      let delta = direction === ROW ? clientX - x : clientY - y;
      let {parentSize} = sizes;
      let deltaRatio = delta / parentSize;
      let paneRatio = this.start.paneRatio - deltaRatio;
      let adjacentRatio = this.start.adjacentRatio + deltaRatio;
      //console.log(pane);
      actions.setSplitRatio(pane.id, paneRatio);
      actions.setSplitRatio(adjacent.id, adjacentRatio);
    };

    this.removeListeners = () => {
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);
    };

    this.onMouseUp = () => {
      this.props.actions.setBlock(false);
      this.removeListeners();
    };

    this.onMouseDown = ({clientX, clientY}) => {
      const {pane, actions} = this.props;
      const adjacent = getAdjacent(this.props);
      this.start = {
        x: clientX,
        y: clientY,
        paneRatio: pane.splitRatio,
        adjacentRatio: adjacent.splitRatio
      };

      actions.setBlock(true);

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
