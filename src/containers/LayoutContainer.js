import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Layout from '../components/Layout';
@connect(state => ({
  layout: state.layout
}))
export default class App extends Component {
  render() {
    console.log(this.props.layout);
    return (
      <div>
        <div>{JSON.stringify(this.props.layout.toJS())}</div>
        <Layout layout={this.props.layout} />
      </div>
    );
  }
}
