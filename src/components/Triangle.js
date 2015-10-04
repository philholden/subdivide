import React, { Component } from 'react';
import Radium from 'radium';
import {
  SW,
  NE,
  SE,
  NW
} from '../constants';

@Radium
export default class Triangle extends Component {
  constructor(props, context) {
    super(props, context);

    this.onMouseDown = () => {
      const {actions, corner, pane} = this.props;
      actions.setCornerDown({...pane.toJS(), corner: corner});
    };
  }

  getStyles() {
    let {corner, color, size, layout, pane} = this.props;
    var offset = (size + 3) / 2;
    var outer = {
      width: size,
      height: size,
      position: 'absolute',
      backgroundColor: 'rgba(0,0,0,0)',
      opacity: 1,
      display: layout.dividerDown ? 'none' : 'block',
      ':hover': {
        opacity: 1
      }
    };

    if (corner === NE) {
      outer = {
        ...outer,
        top: 0,
        right: 0,
        cursor: 'grab',
        transform: 'translate3d(' + (offset) + 'px,' + (-offset) + 'px, 0) rotate(225deg)'
      };
    } else if ( corner === SW) {
      outer = {
        ...outer,
        bottom: 0,
        left: 0,
        cursor: 'grab',
        transform: 'translate3d(' + (-offset) + 'px,' + (offset) + 'px, 0) rotate(45deg)'
      };
    } else if ( corner === SE) {
      outer = {
        ...outer,
        bottom: 0,
        right: 0,
        cursor: 'grab',
        transform: 'translate3d(' + (offset) + 'px,' + (offset) + 'px, 0) rotate(315deg)'
      };
    } else if ( corner === NW) {
      outer = {
        ...outer,
        top: 0,
        left: 0,
        cursor: 'grab',
        transform: 'translate3d(' + (-offset) + 'px,' + (-offset) + 'px, 0) rotate(135deg)'
      };
    }

    let hover = Radium.getState(this.state, 'outer', ':hover') && (!layout.cornerDown || layout.cornerDown.id === pane.id) ? 0 : offset;

    let inner = {
      border: '1px solid #c0c0d0',
      backgroundColor: color,
      width: '100%',
      height: '100%',
      transform: `translate3d(0,${hover}px,0)`,
      transition: 'transform .1s'
    };


    return {outer, inner};

  }

          // <div style={styles.inner} />
  render() {
    var styles = this.getStyles();
    return (
        <div key='outer' style={styles.outer} onMouseDown={this.onMouseDown}>
          <div style={styles.inner} />
        </div>
    );
  }
}


