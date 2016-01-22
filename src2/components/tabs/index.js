import React, { PropTypes, Component } from 'react'
import Radium from 'radium'
import TabsFlex from './tabs-flex'
import TabsTable from './tabs-table'

@Radium
export default class Tabs extends Component {

  static propTypes = {
    /**
     * Select the button kind
     */
    tabs: PropTypes.arrayOf(PropTypes.shape({
      label: React.PropTypes.string.isRequired,
      component: PropTypes.element.isRequired
    }))
  };

  render() {
    return this.props.useTable || /MSIE 9\.0/.test(window.navigator.userAgent) ?
      <TabsTable {...this.props} /> :
      <TabsFlex {...this.props} />
  }
}
