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
  borderCollapse: 'collapse',
  borderSpacing: 0,
  height: 'inherit',
  lineHeight: 1.42857143,
  fontFamily: 'Arial, sans-serif',
  fontSize: 16,
  borderRadius: 0,
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  ':hover': {
    color: '#666'
  }
}

const restStyle = {
  ...borders([ 'top', 'left', 'right' ], strokeColor, 0, 'solid'),
  ...borders([ 'bottom' ], strokeColor, 1, 'solid'),
  display: 'table-cell'
}

const selectedStyle = {
  ...borders([ 'top', 'left', 'right' ], strokeColor, 1, 'solid'),
  ...borders([ 'bottom' ], 'transparent', 1, 'solid'),
  ...padding([ 'left', 'right' ], 10),
  backgroundColor: 'rgb(192, 192, 192)',
  color: 'rgb(51, 51, 51)',
  ':hover': {}
}

const tabListStyle = {
  display: 'table-row',
  height: '42',
  width: '100%'
}

const labelStyle = {
}

const Tab = Radium (props => {
  const { label, onClick, selected } = props

  let style = { ...base }

  if (selected) style = { ...base, ...selectedStyle }

  return (
    <td onClick={onClick} style={style}>
      { label }
    </td>
  )
})

@Radium
export default class TabsTable extends React.Component {
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
        <table style={{ display: 'block', borderSpacing: 0, borderCollapse: 'separate' }}>

          <colgroup>
            <col width="1" />
            <col width="1" />
            <col width="1" />
            <col width="100%" />
          </colgroup>

          <tbody>
          <tr style={tabListStyle}>
            {labels}
            <td style={restStyle}></td>
          </tr>

          </tbody>
        </table>
        { selectedComponent }
      </div>
    )
  }
}
