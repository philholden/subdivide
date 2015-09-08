import React, { Component } from 'react';
import {
  COL
} from '../constants/BlenderLayoutConstants';

function dividerStyle({width, height, top, left, direction, borderSize, touchMargin}) {

  var touch = {
    width: width + 'px',
    height: height + 'px',
    top: top + 'px',
    left: left + 'px',
    backgroundColor: 'rgba(0,255,0,1)',
    position: 'absolute'
  };

  var border = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,1)',
    position: 'absolute'
  };

  var inner = {
    position: 'absolute',
    backgroundColor: '#00f',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  };

  if (direction === COL) {
    touch.cursor = 'row-resize';
    border.top = border.bottom = touchMargin + 'px';
    inner.top = inner.bottom = borderSize + 'px';
  } else {
    touch.cursor = 'col-resize';
    border.left = border.right = touchMargin + 'px';
    inner.left = inner.right = borderSize + 'px';
  }


  return {inner, border, touch};
}

export default class Divider extends Component {
  constructor(props, context) {
    super(props, context);

    this.removeListeners = () => {
      document.removeEventListener('mouseup', this.onMouseUp);
    };

    this.onMouseUp = () => {
      const {actions} = this.props;
      actions.setDividerDown(undefined);
      this.removeListeners();
    };

    this.onMouseDown = ({clientX, clientY}) => {
      const {actions, divider} = this.props;

      actions.setDividerDown({...divider, startX: clientX, startY: clientY});

      document.addEventListener('mouseup', this.onMouseUp);
    };
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  render() {

    const styles = dividerStyle(this.props.divider);

    return (
      <div
        style={styles.touch}
        onMouseDown={this.onMouseDown}
        className="divider">
        <div style={styles.border}>
           <div style={styles.inner}></div>
        </div>
      </div>
    );
  }
}
