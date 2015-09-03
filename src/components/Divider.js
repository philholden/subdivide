import React, { Component } from 'react';
import {
  ROW,
  COL
} from '../constants/BlenderLayoutConstants';

import {getAdjacent} from '../helpers/Metrics';

function dividerStyle({width, height, top, left, direction}) {

  var style = {
    width: width + 'px',
    height: height + 'px',
    top: top,
    left: left,
    backgroundColor: '#333',
    position: 'absolute',
    cursor: direction === COL ? 'ns-resize' : 'ew-resize'
  };

  return style;
}

export default class Divider extends Component {
  constructor(props, context) {
    super(props, context);

    this.onMouseMove = ({clientX, clientY}) => {
      const {actions, divider} = this.props;
      const {beforePaneId, afterPaneId, direction, parentSize} = divider;
      let {x, y} = this.start;
      let delta = direction === ROW ? clientX - x : clientY - y;
      let deltaRatio = delta / parentSize;
      let afterRatio = this.start.afterRatio - deltaRatio;
      let beforeRatio = this.start.beforeRatio + deltaRatio;
      actions.setSplitRatio(beforePaneId, beforeRatio);
      actions.setSplitRatio(afterPaneId, afterRatio);
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
      const {actions, divider} = this.props;
      const {beforeRatio, afterRatio} = divider;
      this.start = {
        x: clientX,
        y: clientY,
        beforeRatio: beforeRatio,
        afterRatio: afterRatio
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

    return (
      <div
        style={dividerStyle(this.props.divider)}
        onMouseDown={this.onMouseDown}
        className="divider" />
    );
  }
}
