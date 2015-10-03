import React, { Component } from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from '../reducers';
import LayoutContainer from './LayoutContainer';

function configureStore(initialState) {
  let store = createStore(reducer, initialState);
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers/index');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}

const store = configureStore();
//window.store = store;

export default class Subdivide extends Component {

  render() {
    const {DefaultComponent} = this.props;
    return (
      <Provider store={store}>
        <LayoutContainer DefaultComponent={DefaultComponent} />
      </Provider>
    );
  }
}
