import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Layout from '../components/Layout';
import * as LayoutActions from '../actions/LayoutActions';

function mapStateToProps(state) {
  return { layout: state.layout };
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(LayoutActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Layout);
