import React, { Component } from 'react';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import reducer from '../reducers';
import LayoutContainer from './LayoutContainer';

let finalCreateStore = compose(
  applyMiddleware(thunk),
  createStore
);

const store = finalCreateStore(reducer);

export default class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <LayoutContainer />
      </Provider>
    );
  }
}
