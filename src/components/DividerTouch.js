import React, { Component } from 'react';
import {
  COL
} from '../constants';

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

      actions.setDividerDown({...divider.toJS(), startX: clientX, startY: clientY});

      document.addEventListener('mouseup', this.onMouseUp);
    };
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  dividerStyle() {
    const {width, height, top, left, direction} = this.props.divider;
    const {touchMargin} = this.props.subdivide;
    var touch = {
      width,
      height,
      top,
      left,
 //     backgroundColor: 'rgba(0,0,0,0.5)',
      position: 'absolute'
    };

    if (direction === COL) {
      touch.cursor = 'row-resize';
      touch.top -= touchMargin;
      touch.height += touchMargin * 2;
    } else {
      touch.cursor = 'col-resize';
      touch.left -= touchMargin;
      touch.width += touchMargin * 2;
    }

    return {touch};
  }

  render() {

    const styles = this.dividerStyle();

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
