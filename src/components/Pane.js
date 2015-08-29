import React, { Component } from 'react';
import Triangle from '../components/Triangle';
import Divider from '../components/Divider';
import {CHILD_LEFT, CHILD_RIGHT, CHILD_BELOW, CHILD_ABOVE, NE, SW} from '../constants/blenderLayoutConstants';





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


  render() {
    return (
      <div>
        <Triangle
          corner={SW}
          color='#ccc'
          size={55}
        />
        <Triangle
          corner={NE}
          color='#ccc'
          size={55}
          onMouseDown={this.onMouseDownTop}
        />
        <Divider
          splitType={CHILD_ABOVE}
        />
        <Divider
          splitType={CHILD_BELOW}
          color='#777'
        />
        <Divider
          splitType={CHILD_LEFT}
        />
        <Divider
          splitType={CHILD_RIGHT}
        />

      </div>
    );
  }
}
