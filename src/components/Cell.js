import React, { Component } from 'react';
import Radium from 'radium';
import {
  ROW,
  COL
} from '../../src/constants/BlenderLayoutConstants';
import Divider from './Divider';


function cellStyles({layout, pane}) {
  const {direction, splitRatio, id} = pane;
  const parent = layout.panes.get(pane.parentId);
  const {rootId} = layout;
  let paneStyle = {
    alignItems: 'stretch',
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex'
    // ':hover': {
    //   backgroundColor: 'rgba(0,0,0,0.1)'
    // }
  };

  let cellStyle = {
      display: 'flex',
      flex: 1,
      backgroundColor: 'pink',
      position: 'relative',
      alignItems: 'stretch'
  };

  let contentsStyle = {
      display: 'flex',
      flex: 1,
      position: 'relative',
      alignItems: 'stretch',
      overflow: 'hidden'
  };

  if (parent && parent.isGroup) {
    if (parent.direction === ROW) {
      paneStyle.width = splitRatio * 100 + '%';
      paneStyle.height = '100%';
    }
    if (parent.direction === COL) {
      paneStyle.width = '100%';
      paneStyle.height = splitRatio * 100 + '%';
      cellStyle.flexDirection = 'column';
    }
  }

  if (!parent || parent.direction !== COL) {
    paneStyle.height = '100%';
    contentsStyle.height = '100%';
  }
  cellStyle.height = '100%';

  if (id === rootId) {
    paneStyle.width = '100%';
  }

  if (direction === COL) contentsStyle.flexDirection = 'column';
  if (direction === ROW) contentsStyle.flexDirection = 'row';

  return {paneStyle, cellStyle, contentsStyle};
}

@Radium
export default class Cell extends Component {
  render() {

    const {paneStyle, contentsStyle, cellStyle} = cellStyles(this.props);
    const {pane, layout} = this.props;
    return (
      <div style={paneStyle} className="pane">
        <div style={cellStyle} className="cell">
          <Divider pane={pane} layout={layout} />
          <div style={contentsStyle} className="contents">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}
