import React, { Component } from 'react';
import Radium from 'radium';
import {NE, SW} from '../constants/BlenderLayoutConstants';
import {getAdjacent} from '../helpers/Metrics';
import {
  SPLIT_JOIN_MODE
} from '../../src/constants/BlenderLayoutConstants';

function triangleStyle({corner, color, size}) {
  var offset = size / 2;
  var style = {
    width: size + 'px',
    height: size + 'px',
    position: 'absolute',
    backgroundColor: color,
    ':hover': {
      backgroundColor: 'red'
    }
  };

  switch (corner) {
    case NE:
      return {
        ...style,
        top: 0,
        right: 0,
//        cursor: 'sw-resize',
        cursor: 'grab',
        transform: 'translate3d(' + (offset) + 'px,' + (-offset) + 'px, 0) rotate(45deg)',
      };
    case SW:
      return {
        ...style,
        bottom: 0,
        left: 0,
    //    cursor: 'ne-resize',
        cursor: 'grab',
        transform: 'translate3d(' + (-offset) + 'px,' + (offset) + 'px, 0) rotate(45deg)',
      };
  }
  return style;
}

@Radium
export default class Triangle extends Component {
  constructor(props, context) {
    super(props, context);

    this.onMouseMove = ({clientX, clientY}) => {
      const {actions, pane} = this.props;
      //const adjacent = getAdjacent(this.props);
      //const {direction, adjacentSize} = sizes;
      let {x, y} = this.start;
      let delta = {x: clientX - x, y: clientY - y};
      if (Math.abs(delta.x) > 20 || Math.abs(delta.y) > 20) {
        console.log('split mode');
        actions.setMode(pane.id, SPLIT_JOIN_MODE, x, y);
        document.removeEventListener('mousemove', this.onMouseMove);
      }
    };

    this.removeListeners = () => {
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);
    };

    this.onMouseUp = ({clientX, clientY}) => {
      // const {corner} = this.props;
      // let {start} = this;
      // let {x, y} = {x: clientX - start.x, y: clientY - start.y};
      // console.log(x, y);
      // if (corner === NE) {
      //   if (x < 0 && y > 0) {
      //     if (-x > y && -x > 20) {
      //       console.log('new row');
      //     } else if (-x <= y && y > 20) {
      //       console.log('new col');
      //     }
      //   }

      // }
      const {actions, pane} = this.props;
      actions.setMode(undefined, undefined);
      console.log('split mode off');
      this.removeListeners();
    };

    this.onMouseDown = ({clientX, clientY}) => {
      //const {pane} = this.props;
      //const adjacent = getAdjacent(this.props);
      this.start = {
        x: clientX,
        y: clientY
      };

      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
    };
  }

  render() {
    const styles = triangleStyle(this.props);
    return (
      <div style={styles} onMouseDown={this.onMouseDown} />
    );
  }
}


