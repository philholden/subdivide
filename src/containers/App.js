import React, { Component } from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import reducer from '../reducers';
import LayoutContainer from './LayoutContainer';

function configureStore(initialState) {
  let finalCreateStore = compose(
    applyMiddleware(thunk),
  )(createStore);

  let store = finalCreateStore(reducer, initialState);
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

export default class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <LayoutContainer />
      </Provider>
    );
  }
}
