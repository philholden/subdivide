import React, { Component } from 'react';
import Radium from 'radium';
import {
  ROW,
  COL
} from '../../src/constants/BlenderLayoutConstants';
import Divider from './Divider';


function cellStyles({
      width,
      height,
      contentWidth,
      contentHeight
    }) {
  let paneStyle = {
    float: 'left',
    width: width + 'px',
    height: height + 'px',
    position: 'relative'
    // ':hover': {
    //   backgroundColor: 'rgba(0,0,0,0.1)'
    // }
  };

  let contentStyle = {
    float: 'left',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#xxx'.replace(/x/g, () => ((Math.random() * 16) | 0).toString(16)),
    width: contentWidth + 'px',
    height: contentHeight + 'px'
  };

  return {paneStyle, contentStyle};
}

@Radium
export default class Cell extends Component {

  shouldDisplayDivider() {
    const {pane, layout} = this.props;
    if (layout.rootId === pane.id) return false;
    const {id, parentId} = pane;
    const parent = layout.panes.get(parentId);
    const siblings = parent.childIds;
    const isFirst = siblings.first() === id;
    return !isFirst;
  }

  render() {
    const {pane, layout, sizes, actions} = this.props;
    const {paneStyle, contentStyle} = cellStyles(sizes);
    return (
      <div style={paneStyle} className="pane">
        <Divider
          pane={pane}
          layout={layout}
          sizes={sizes}
          actions={actions}
          />
        <div style={contentStyle} className="contents">
          {this.props.children}
        </div>
      </div>
    );
  }
}
