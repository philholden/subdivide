import React, { Component } from 'react';
import Pane from './Pane';
import Divider from './Divider';
import {flatten} from '../helpers/LayoutHelper';
import {Map, fromJS} from 'immutable';

export default class Layout extends Component {
  constructor(props, context) {
    super(props, context);
    const {setSize} = props.actions;
    window.addEventListener('resize', () => {
      setSize(window.innerWidth, window.innerHeight);
    });

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

    console.log(paneMap);

    setSize(window.innerWidth, window.innerHeight);
  }

  componentWillReceiveProps(nextProps) {
    const {layout} = nextProps;
    const {dividers, panes} = this.state;
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

// <div style={{
//           width: 55 / Math.sqrt(2) + 'px',
//           height: 55 / Math.sqrt(2) + 'px',
//           position: 'absolute',
//           top: 0,
//           right: 0,
//           backgroundColor: 'blue'
//         }}></div>
//         <div style={{
//           width: 55 / Math.sqrt(2) + 'px',
//           height: 55 / Math.sqrt(2) + 'px',
//           position: 'absolute',
//           bottom: 0,
//           left: 0,
//           backgroundColor: 'blue'
//         }}></div>
