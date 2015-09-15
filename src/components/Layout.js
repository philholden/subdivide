import React, { Component } from 'react';
import Pane from './Pane';
import Dividers from './Dividers';
import AnimationFrame from '../helpers/AnimationFrame';
import {
  CHILD_ABOVE,
  CHILD_BELOW,
  CHILD_LEFT,
  CHILD_RIGHT,
  ROW,
  SW,
  NE
} from '../constants/BlenderLayoutConstants';

export default class Layout extends Component {
  constructor(props, context) {
    super(props, context);
    this.animationFrame = new AnimationFrame();
    const {setSize} = props.actions;

    this.onMouseMove = this.animationFrame.throttle(({clientX, clientY}) => {
      const {actions, layout} = this.props;

      if (layout.dividerDown) {
        const divider = layout.dividerDown;
        const {
          beforePaneId,
          afterPaneId,
          direction,
          parentSize,
          startX,
          startY
        } = divider;

        let delta = direction === ROW ?
          clientX - startX :
          clientY - startY;
        let deltaRatio = delta / parentSize;
        let afterRatio = divider.afterRatio - deltaRatio;
        let beforeRatio = divider.beforeRatio + deltaRatio;
        if (beforeRatio * parentSize > 20 && afterRatio * parentSize > 20) {
          actions.setSplitRatio(beforePaneId, beforeRatio);
          actions.setSplitRatio(afterPaneId, afterRatio);
        }
      }

      if (layout.cornerDown) {
        const pane = layout.cornerDown;
        const {split} = actions;
        const {width, height, left, top, id, corner} = pane;

        if (clientX > left && clientX < left + width &&
          clientY > top && clientY < top + height) {

          if (corner === SW) {
            if (clientX - left > 25) {
              split(id, CHILD_LEFT, clientX, clientY);
            } else if (top + height - clientY > 25) {
              split(id, CHILD_BELOW, clientX, clientY);
            }
          }

          if (corner === NE) {
            if (left + width - clientX > 25) {
              split(id, CHILD_RIGHT, clientX, clientY);
            } else if (clientY - top > 25) {
              split(id, CHILD_ABOVE, clientX, clientY);
            }
          }
        }
      }

    });

    this.onMouseUp = () => {
      const {actions, layout} = this.props;
      if (layout.dividerDown) {
        actions.setDividerDown(undefined);
      }
      // give pane onMouseUp a chance to fire
      setTimeout(()=>{
        if (layout.cornerDown) {
          actions.setCornerDown(undefined);
        }
      }, 10);
    };

    window.addEventListener('resize', () => {
      setSize(window.innerWidth, window.innerHeight);
    });

    document.addEventListener('mouseup', this.onMouseUp);
    document.addEventListener('mousemove', this.onMouseMove);


    setSize(window.innerWidth, window.innerHeight);
  }

  componentWillUnmount() {
    this.animationFrame.stop();
  }

  render() {
    const {layout, actions, DefaultComponent} = this.props;

    let panes = layout.panes.toList().filter(pane => !pane.isGroup)
      .map(pane => {
        return <Pane
          layout={layout}
          pane={pane}
          actions={actions}
          key={pane.id}
          DefaultComponent={DefaultComponent}
        />;
      });

    return (
      <div>
        {panes}
        <Dividers dividers={layout.dividers} layout={layout} actions={actions} />
      </div>
    );
  }
}
