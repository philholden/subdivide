import React, { Component } from 'react'
import Subdivide from '../../src/index'
import Radium from 'radium'

const urls = [
  { url: 'http://ncredinburgh.com', label: 'NCR' },
  { url: 'http://coenraets.org/present/react/#0', label: 'Slide Show' },
  { url: 'http://jsbin.com/vexawi/2/edit?js', label: 'jsbin' },
  { url: 'http://www.hccs.edu/media/houston-community-college/district/academic-affairs/4_Approved_Faculty_CurriculumVitae_Sample_02Feb2011.pdf?js', label: 'CV' }
]

const Iframe = ({ src }) => (
  <iframe src={src} frameBorder={'0'} style={{
    width: '100%',
    height: '100%'
  }} />
)

const Link = Radium(({ onSelect, children }) => (
  <div onClick={onSelect} style={styles.linkOuter}>
    <div>{children}</div>
  </div>
))

const Menu = ({ urls, onSelect }) => (
  <div style={styles.menu}>
    {
      urls.map(({ url, label }, i) => (
        <Link onSelect={() => onSelect(url)} key={i}>
          {label}
        </Link>
      ))
    }
  </div>
)

class Chooser extends Component {
  constructor(props, ctx) {
    super(props, ctx)
    this.state = { url: '' }
  }

  onSelect(url) {
    this.setState({ url })
  }

  render() {
    const { url } = this.state

    return url === '' ?
      <Menu urls={urls} onSelect={this.onSelect.bind(this)}/> :
      <Iframe src={url} />
  }
}

const App = () => <Subdivide DefaultComponent={Chooser} />

const styles = {
  menu: {
    display: 'flex',
    flexDirection: 'column',
    margin: 2,
    fontFamily: 'sans-serif',
    colof: '#333'
  },
  linkOuter: {
    display: 'flex',
    flex: 1,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eee',
    cursor: 'pointer',
    transition: 'color .3s',
    margin: 2,
    ':hover': {
      backgroundColor: '#f5f5f5'
    }
  }
}

export default App
