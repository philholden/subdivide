import React, { Component } from 'react';
import Pane from './Pane';
import Divider from './Divider';
import {flatten} from '../helpers/LayoutHelper';
import AnimationFrame from '../helpers/AnimationFrame';
import {
  ROW
} from '../constants/BlenderLayoutConstants';

export default class Layout extends Component {
  constructor(props, context) {
    super(props, context);
    this.animationFrame = new AnimationFrame();
    const {setSize} = props.actions;

    this.onMouseMove = this.animationFrame.throttle(({clientX, clientY}) => {
      const {actions, layout} = this.props;
      if (!layout.dividerDown) return;
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
    });

    window.addEventListener('resize', () => {
      setSize(window.innerWidth, window.innerHeight);
    });

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
