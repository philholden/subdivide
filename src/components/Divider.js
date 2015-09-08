import React, { Component } from 'react';
import {
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
        style={styles.outer}
        onMouseDown={this.onMouseDown}
        className="divider">
         <div style={styles.inner}></div>
        </div>
    );
  }
}
