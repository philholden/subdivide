import React, { Component } from 'react';
import Radium from 'radium';
import {NE, SW} from '../constants/BlenderLayoutConstants';
import {
  SPLIT_JOIN_MODE
} from '../../src/constants/BlenderLayoutConstants';
import {findCornerAdjacent} from '../helpers/LayoutHelper';

function triangleStyle({corner, color, size}) {
  var offset = (size + 3) / 2;
  var style = {
    width: size + 'px',
    height: size + 'px',
    position: 'absolute',
    backgroundColor: color,
    opacity: 0,
    transition: 'opacity 0.2s',
    border: '1px solid rgba(0,0,0,0.5)',
    ':hover': {
      opacity: 1
    }
  };

  switch (corner) {
    case NE:
      return {
        ...style,
        top: 0,
        right: 0,
        cursor: 'grab',
        transform: 'translate3d(' + (offset) + 'px,' + (-offset) + 'px, 0) rotate(45deg)'
      };
    case SW:
      return {
        ...style,
        bottom: 0,
        left: 0,
        cursor: 'grab',
        transform: 'translate3d(' + (-offset) + 'px,' + (offset) + 'px, 0) rotate(45deg)'
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
        actions.setMode(pane.id, SPLIT_JOIN_MODE, x, y);
        document.removeEventListener('mousemove', this.onMouseMove);
      }
    };

    this.removeListeners = () => {
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);
    };

    this.onMouseUp = () => {

      const {actions} = this.props;
      actions.setMode(undefined, undefined);
      actions.setBlock(false);
      actions.setCornerDown(undefined, undefined);
      this.removeListeners();
    };

    this.onMouseDown = ({clientX, clientY}) => {
      const {actions, corner, pane} = this.props;
      //const {pane} = this.props;
      //const adjacent = getAdjacent(this.props);
      this.start = {
        x: clientX,
        y: clientY
      };
      actions.setBlock(true);
      actions.setCornerDown(pane.id, corner);
      console.log('hello', pane.id);

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


