import React from 'react'
import ReactDOM from 'react-dom'

import Docs from './docs'
import { hashHistory } from 'react-router'

if (module.hot) {
  module.hot.decline('./docs')
}


const content = document.getElementById('content')
ReactDOM.render(<Docs history={hashHistory} />, content)
