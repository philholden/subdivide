import React, { Component } from 'react';
import Triangle from './Triangle';

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

  // width %
  // height %
  // split (NO_SPLIT | ROW_SPLIT | COL_SPLIT)
  // child component
  // parent

  renderGroup() {
    const {pane, layout} = this.props;
    const children = pane.childIds.map(id => layout.panes.get(id));
    return (
      <Cell pane={pane} layout={layout} >
        {children.map(child => <Pane layout={layout} pane={child} key={child.id} />)}
      </Cell>
    );
  }


  renderSingle() {
    const {pane, layout} = this.props;
    return (
      <Cell layout={layout} pane={pane}>
        <Triangle
          corner={SW}
          color='#ccc'
          size={55}
        />
        <Triangle
          corner={NE}
          color='#333'
          size={55}
          onMouseDown={this.onMouseDownTop}
        />
      </Cell>
    );
  }

  render() {
    const {pane, layout} = this.props;
    if (pane.childIds.size > 1) {
      return this.renderGroup();
    } else {
      return this.renderSingle();
    }
  }
}
