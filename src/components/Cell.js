import React, { Component } from 'react';
import Radium from 'radium';
import {
  ROW,
  COL
} from '../../src/constants/BlenderLayoutConstants';
import Divider from './Divider';


function cellStyle({layout, pane}) {
  const {isGroup, direction, splitRatio, id} = pane;
  const parent = layout.panes.get(pane.parentId);
  const {dividerWidth, rootId} = layout;
  var style = {
    alignItems: 'stretch',
    backgroundColor: 'blue',
    ':hover': {
      backgroundColor: 'rgba(0,0,0,0.1)'
    }
  };

  if (parent && parent.isGroup) {
    const isLast = parent.childIds.last() === pane.id;
    if (parent.direction === ROW) {
      style.width = splitRatio * 100 + '%';
    }
    if (parent.direction === COL) {
      style.height = splitRatio * 100 + '%';
    }
  }
  if (id === rootId) {
    style.width = '100%';
  }

  if (isGroup) style.display = 'flex';
  if (direction === 'COL') style.flexDirection = 'column';

  return style;
}

@Radium
export default class Cell extends Component {
  render() {
    const fill = {display: 'flex', flex: 1};
    const styles = cellStyle(this.props);
    const {pane, layout} = this.props;
    return (
      <div style={styles}>
        <div style={fill}>
          <Divider pane={pane} layout={layout} />
          <div style={fill}>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}
