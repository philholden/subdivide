import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Layout from '../components/Layout';
import * as LayoutActions from '../actions/LayoutActions';
@connect(state => ({
  layout: state.layout
}))
export default class LayoutContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.actions = bindActionCreators(
      LayoutActions,
      this.props.dispatch
    );
    window.actions = this.actions;
  }
  render() {
    const {layout, DefaultComponent} = this.props;
    const {actions} = this;
    const props = {layout, actions, DefaultComponent};
    return (
      <Layout {...props} />
    );
  }
}
