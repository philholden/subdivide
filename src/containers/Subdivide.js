import React, { Component } from 'react';
import { createStore, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import reducer from '../reducers';
import Layout from '../components/Layout';
import * as SubdivideActionCreators from '../actions/SubdivideActionCreators';

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

const ConnectedLayout = connect(
  state => ({ subdivide: state })
)(Layout);

export default class Subdivide extends Component {
  constructor(props) {
    super(props);

    const {dispatch} = props;
    if (dispatch) {
      this.actions = bindActionCreators(SubdivideActionCreators, dispatch);
    } else {
      this.store = configureStore();
      this.actions = bindActionCreators(SubdivideActionCreators, this.store.dispatch);
    }
  }

  render() {
    const {store, actions} = this;
    return store ?
      <ConnectedLayout {...this.props} store={store} actions={actions} /> :
      <Layout {...this.props} actions={actions} />;
  }
}
