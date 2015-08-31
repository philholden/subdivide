import React, { Component } from 'react';
import Radium from 'radium';
import {NE, SW} from '../constants/BlenderLayoutConstants';

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
        transform: 'translate3d(' + (offset) + 'px,' + (-offset) + 'px, 0) rotate(45deg)',
      };
    case SW:
      return {
        ...style,
        bottom: 0,
        left: 0,
        transform: 'translate3d(' + (-offset) + 'px,' + (offset) + 'px, 0) rotate(45deg)',
      };
  }
  return style;
}

//        <div style={{ width: '30px', height: '30px', backgroundColor: 'green' }} />

@Radium
export default class Triangle extends Component {
  render() {
    const styles = triangleStyle(this.props);
    return (
      <div style={styles} onMouseDown={this.props.onMouseDown} />
    );
  }
}

        // <div style={{
        //   width: 55 / Math.sqrt(2) + 'px',
        //   height: 55 / Math.sqrt(2) + 'px',
        //   position: 'absolute',
        //   top: 0,
        //   right: 0,
        //   backgroundColor: 'blue'
        // }}></div>
        // <div style={{
        //   width: 55 / Math.sqrt(2) + 'px',
        //   height: 55 / Math.sqrt(2) + 'px',
        //   position: 'absolute',
        //   bottom: 0,
        //   left: 0,
        //   backgroundColor: 'blue'
        // }}></div>

