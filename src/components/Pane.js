import React, { Component } from 'react';
import Triangle from './Triangle';
import {getSizes} from '../helpers/Metrics';

import Cell from './Cell';
import {
  CHILD_LEFT,
  CHILD_RIGHT,
  CHILD_BELOW,
  CHILD_ABOVE,
  NE,
  SW
} from '../constants/BlenderLayoutConstants';



export default class Pane extends Component {
  constructor(props, context) {
    super(props, context);

    this.onMouseMove = (e) => {
      console.log(e);
    };

    this.onMouseDownTop = () => {
//      document.addEventListener('mouseup', ()=)
    };

    this.removeChildPane = () => {
      var childOfChild;
      if (this.state.childPane) {
        childOfChild = this.state.childPane.state.childPane;
        childOfChild.setState({
          parentPane: this
        });
        this.setState({
          childPane: childOfChild
        });
      } else {
        this.setState({
          childPane: null,
          splitType: CHILD_NONE
        });
      }
    };

    this.addChildPane = () => {

    };

  }

  renderGroup() {
    const {pane, layout, sizes, actions} = this.props;
    const children = pane.childIds.map(id => layout.panes.get(id));
    const kids = child => {
      const {contentWidth, contentHeight} = sizes;
      let childSizes = getSizes({layout, pane: child}, contentWidth, contentHeight);
      return <Pane layout={layout} pane={child} key={child.id} sizes={childSizes} actions={actions} />;
    };
    return (
      <Cell layout={layout} pane={pane} sizes={sizes} actions={actions}>
        {children.map(kids)}
      </Cell>
    );
  }


  renderSingle() {
    const {pane, layout, sizes, actions} = this.props;

    return (
      <Cell layout={layout} pane={pane} sizes={sizes} actions={actions}>
        <Triangle
          corner={SW}
          color='#ccc'
          size={40}
        />
        <Triangle
          corner={NE}
          color='#333'
          size={40}
          onMouseDown={this.onMouseDownTop}
        />
        {pane.id}
      </Cell>
    );
  }


  render() {
    const {pane, sizes} = this.props;

    if (pane.childIds.size > 1) {
      return this.renderGroup();
    } else {
      return this.renderSingle();
    }
  }
}
