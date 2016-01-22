import React from 'react'
import ReactDOM from 'react-dom'
import Ecology from 'ecology'
import Radium, { Style } from 'radium'
import * as docgen from 'react-docgen'
import Button from '../src/components/button'
import Tabs from '../src/components/tabs'
import TableLeapfrog, { colsFlex } from '../src/components/table/table-leapfrog'
import {
  Router, Route, IndexRoute, Link,
  createMemoryHistory,
  hashHistory,
  browserHistory
} from 'react-router'

import { VictoryTheme } from 'formidable-landers'

export const history = createMemoryHistory('/')


const theme = {
  ...VictoryTheme,
  '.Interactive': {
    minHeight: 20
  },
  '.Interactive .playgroundPreview': {
    background: '#fff',
    border: '1px solid #ebe3db',
    flex: '0 0 100%',
    position: 'relative',
    display: 'block !important',
    verticalAlign: 'top',
    padding: 10
  },
  '.Container': {
    margin: '20px 40px'
  }
}

const pages = [
  { path: 'button', scope: { Button } },
  { path: 'tabs', scope: { Tabs }, source: 'tabs/index'  },
  { path: 'table-leapfrog', scope: { TableLeapfrog, colsFlex }, source: 'table/table-leapfrog'  }
]



// if (module.hot) {
//   // Enable Webpack hot module replacement for reducers
//   pages.forEach(({ path }) => {
//     module.hot.accept(`!!raw!./pages/${path}.md`, () => {
//       window.location.reload()
//     })
//   })
// }

// const Themed = (props) => (
//   <div>
//     <Ecology
//       {...props}
//       playgroundtheme="elegant" />
//     <Style rules={theme}/>
//   </div>
// )



const GuideRoute = ({ path, scope, source = path }, i) => {
  scope = { React, ReactDOM, ...scope }
  const overview = require(`!!raw!./pages/${path}.md`)
  source = docgen.parse(require(`!!raw!../src/components/${source}`))
  console.log(path, source)
  const component = Radium(() => (
    <div>
      <Ecology
        {...{ scope, overview, source }}
        playgroundtheme="elegant" />
      <Style rules={theme}/>
    </div>
  ))
  return <Route path={path} component={component} key={i} />
}

const App = props => (
  <div style={{
    display: 'flex'
  }}>
    <Menu />
    <div style={{ flex: 1 }}>
    {props.children}
    </div>
  </div>
)

const Menu = () => (
  <ul style={{
    marginLeft: 10,
    marginRight: 40,
    marginTop: 20,
    paddingLeft: 0
  }}>
    {pages.map((page, i) => (
      <li key={i}><Link to={page.path}>{page.path}</Link></li>
    ))}
  </ul>
)

const Home = () => <div>Home</div>

//          <Route path="button" component={Buttn} />
export default class Docs extends React.Component {

  render() {
    const history = this.props.isStatic ?
      createMemoryHistory(this.props.path || '/') :
      hashHistory

    return (
      <Router history={history}>
        <Route path="/" component={App}>
          <IndexRoute component={Home} />
          { pages.map(GuideRoute) }

        </Route>
      </Router>
    )
  }
}
