import React, { Component } from 'react';
import {
  ROW,
  COL
} from '../constants/BlenderLayoutConstants';

function dividerStyle({width, height, top, left, direction}) {

  var outer = {
    width: width + 'px',
    height: height + 'px',
    top: (top - 1) + 'px',
    left: (left - 1) + 'px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    position: 'absolute'
  };

  var inner = {
    backgroundColor: '#000'
  };

  let borderStyle = '1px solid #ccc';

  if (direction === COL) {
    outer.cursor = 'ns-resize';
    outer.paddingTop = '1px';
    outer.paddingBottom = '1px';
  } else {
    outer.cursor = 'ew-resize';
    outer.paddingLeft = '1px';
    outer.paddingRight = '1px';
  }


  return {inner, outer};
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

    const styles = dividerStyle(this.props.divider)

    return (
      <div
        style={styles.outer}
        onMouseDown={this.onMouseDown}
        className="divider">
         <div style={styles.inner}></div>
        </div>
    );
  }
}
