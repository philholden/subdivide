import React from 'react'
import Radium from 'radium'

const strokeColor = '#acacac'

const capitalize = (word) => {
  return word[0].toUpperCase() + word.substring(1)
}

const borders = (sides = [], color, width, style) => {
  let styles = {}
  sides.forEach((side) => {
    let capital = capitalize(side)
    if (color !== undefined) styles[`border${capital}Color`] = color
    if (width !== undefined) styles[`border${capital}Width`] = width
    if (style !== undefined) styles[`border${capital}Style`] = style
  })
  return styles
}

const padding = (sides = [], width) => {
  let styles = {}
  sides.forEach((side) => {
    let capital = capitalize(side)
    styles[`padding${capital}`] = width
  })
  return styles
}

const base = {
  ...borders([ 'bottom' ], strokeColor, 1, 'solid'),
  ...borders([ 'top', 'left', 'right' ], 'transparent', 0, 'solid'),
  ...padding([ 'left', 'right' ], 11),
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  lineHeight: 1.42857143,
  fontFamily: 'Arial, sans-serif',
  fontSize: 16,
  borderRadius: 0,
  whiteSpace: 'nowrap',
  userSelect: 'none',
  cursor: 'pointer',
  ':hover': {
    color: '#666'
  }
}

const restStyle = {
  ...borders([ 'bottom' ], strokeColor, 1, 'solid'),
  flex: 1
}

const selectedStyle = {
  ...borders([ 'top', 'left', 'right' ], strokeColor, 1, 'solid'),
  ...borders([ 'bottom' ], 'transparent', 1, 'solid'),
  ...padding([ 'left', 'right' ], 10),
  backgroundColor: 'rgb(192, 192, 192)',
  backgroundImage: 'linear-gradient(rgb(255, 255, 255) 0px, rgb(221, 221, 221) 100%)',
  color: 'rgb(51, 51, 51)',
  ':hover': {}
}

const tabListStyle = {
  justifyContent: 'center',
  height: '42',
  alignItems: 'stretch',
  display: 'flex'
}

const Tab = Radium (props => {
  const { label, onClick, selected } = props

  let style = { ...base }

  if (selected) style = { ...base, ...selectedStyle }

  return (
    <div onClick={onClick} style={style}>
      <div>{ label }</div>
    </div>
  )
})

@Radium
export default class TabsFlex extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      selected: 0
    }
  }

  select(i) {
    this.setState({
      selected: i
    })
  }

  render() {
    const { tabs } = this.props
    const { selected } = this.state
    const selectedComponent = selected === undefined ? false : tabs[selected].component

    const labels = tabs.map((tab, i) => (
      <Tab key={i} onClick={() => this.select(i)} label={tab.label} selected={selected === i} />
    ))

    return (
      <div>
        <div style={tabListStyle}>
          {labels}
          <div style={restStyle}></div>
        </div>
        { selectedComponent }
      </div>
    )
  }
}
