import React, { Component } from 'react';
import {CHILD_LEFT, CHILD_RIGHT, CHILD_BELOW, CHILD_ABOVE, CHILD_NONE} from '../constants/blenderLayoutConstants';

function dividerStyle({splitType, size = 5, color = '#444'}) {

  var style = {
    position: 'absolute',
    backgroundColor: color,
    ':hover': {
      backgroundColor: 'red'
    }
  };

  if (splitType === CHILD_LEFT ||
      splitType === CHILD_RIGHT) {
    return {
      ...style,
      top: 0,
      bottom: 0,
      width: size + 'px',
      left: splitType === CHILD_LEFT ? 'auto' : 0,
      right: splitType === CHILD_LEFT ? 0 : 'auto'
    };
  }

  if (splitType === CHILD_ABOVE ||
    splitType === CHILD_BELOW) {
    return {
      ...style,
      left: 0,
      right: 0,
      height: size + 'px',
      top: splitType === CHILD_BELOW ? 'auto' : 0,
      bottom: splitType === CHILD_BELOW ? 0 : 'auto'
    };
  }
}


export default class Divider extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    if (this.props.splitType === undefined) return null;
    return (
      <div style={dividerStyle(this.props)} />
    );
  }
}
