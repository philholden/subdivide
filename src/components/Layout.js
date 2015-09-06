import React, { Component } from 'react';
import Pane from './Pane';
import Divider from './Divider';
import {flatten} from '../helpers/LayoutHelper';
import AnimationFrame from '../helpers/AnimationFrame';
import {
  CHILD_ABOVE,
  CHILD_BELOW,
  CHILD_LEFT,
  CHILD_RIGHT,
  ROW,
  COL,
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
        actions.setSplitRatio(beforePaneId, beforeRatio);
        actions.setSplitRatio(afterPaneId, afterRatio);
      }

      if (layout.cornerDown) {
        const pane = layout.cornerDown;
        const {split, setCornerDown} = actions;
        const {width, height, left, top, id, corner} = pane;

        if (clientX > left && clientX < left + width &&
          clientY > top && clientY < top + height) {

          if (corner === SW) {
            if (clientX - left > 20) {
              split(id, CHILD_LEFT);
              setCornerDown(undefined);
            } else if (top + height - clientY > 20) {
              split(id, CHILD_BELOW);
              setCornerDown(undefined);
            }
          }

          if (corner === NE) {
            if (left + width - clientX > 20) {
              split(id, CHILD_RIGHT);
              setCornerDown(undefined);
            } else if (clientY - top > 20) {
              split(id, CHILD_ABOVE);
              setCornerDown(undefined);
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
      if (layout.displayBlock) {
        actions.setBlock(false);
      }
    };

    window.addEventListener('resize', () => {
      setSize(window.innerWidth, window.innerHeight);
    });

    document.addEventListener('mouseup', this.onMouseUp);
    document.addEventListener('mousemove', this.onMouseMove);

    let {dividerMap, paneMap} = flatten(
      props.layout,
      props.layout.rootId, {
        width: props.layout.width,
        height: props.layout.height
      }
    );

    this.state = {
      dividers: Object.values(dividerMap),
      panes: Object.values(paneMap)
    };

    setSize(window.innerWidth, window.innerHeight);
  }

  componentWillUnmount() {
    this.animationFrame.stop();
  }

  componentWillReceiveProps(nextProps) {
    const {layout} = nextProps;
    let {dividerMap, paneMap} = flatten(
      layout,
      layout.rootId, {
        width: layout.width,
        height: layout.height
      }
    );
    this.setState({
      dividers: Object.values(dividerMap),
      panes: Object.values(paneMap)
    });
  }


  render() {
    const {layout, actions} = this.props;
    console.log(layout.toJS());
    const panes = this.state.panes.map(pane => {
      return <Pane layout={layout} pane={pane} actions={actions} key={pane.id} />;
    });
    const dividers = this.state.dividers.map(divider => {
      return <Divider layout={layout} divider={divider} actions={actions} key={divider.id} />;
    });
    return (
      <div>{panes}{dividers}</div>
    );
  }
}
