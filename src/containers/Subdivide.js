import React, { Component } from 'react';
import { createStore } from 'redux';
import reducer from '../reducers';
import LayoutContainer from './LayoutContainer';

function configureStore(initialState) {
  let store = createStore(reducer, initialState);
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}

export default class Subdivide extends Component {
  constructor(props) {
    super(props);
    this.store = configureStore();
  }

  render() {
    const {DefaultComponent} = this.props;
    return (
      <LayoutContainer DefaultComponent={DefaultComponent} store={this.store} />
    );
  }
}
