import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Layout from '../components/Layout';
@connect(state => ({
  store: state.layout
}))
export default class App extends Component {
  render() {
    const {store} = this.props;
    const {layout} = store;
    console.log(layout.toJS());
    return (
      <Layout layout={layout} />
    );
  }
}
