import React, { PropTypes, Component } from 'react'
import Radium from 'radium'
import {
  fromCss,
  lighten,
  darken,
  toCss,
  luminance
} from 'color-array'

const defaults = {
  primaryColor: '#666',
  darkGray: '#333',
  midGray: '#ccc',
  lightGray: '#ededed',
  buttonStrokeColor: '#acacac' //172
}

const getCursor = (element, cursor) => {
  if (cursor) return cursor
  if (element === 'a') return 'pointer'
  return 'default'
}

const primaryGradient = (primaryColor, darkGray) => {
  const rgbaArr = fromCss(primaryColor)
  const normalizedColor = toCss(rgbaArr)
  let bottom, top
  let color = '#fff'
  let hoverColor

  //console.log(rgbaArr,luminance(rgbaArr),lighten(rgbaArr, 0.18))

  if (normalizedColor === '#666666') {
    top ='#767676'
    bottom = primaryColor
    hoverColor = toCss(darken(rgbaArr, .25))
  } else if (luminance(rgbaArr) > 127) {
    top = toCss(lighten(rgbaArr, .18))
    bottom = primaryColor
    color = darkGray
    hoverColor = toCss(lighten(rgbaArr, .25))
  } else {
    top = primaryColor
    bottom = toCss(darken(rgbaArr, .18))
    hoverColor = toCss(darken(rgbaArr, .25))
  }

  return {
    backgroundImage: `linear-gradient(to bottom,${top} 0, ${bottom} 100%)`,
    color,
    ':hover': {
      backgroundColor: hoverColor
    }
  }
}

@Radium
export default class Button extends Component {
  static propTypes = {
    /**
     * Select the button kind
     */
    kind: PropTypes.oneOf([ 'primary', 'secondary', 'tertiary' ])
  };

  static defaultProps = {
    kind: 'secondary',
    theme: defaults
  };

  render() {

    const theme = {
      ...defaults,
      ...this.props.theme
    }

    const {
      block,
      href,
      size,
      children,
      kind,
      cursor,
      ...rest
    } = this.props

    const element = href === undefined ? 'button' : 'a'

    const styles = {

      base: {
        borderWidth: 0,
        borderStyle: 'solid',
        boxSizing: 'border-box',
        display: 'inline-block',
        fontFamily: 'Arial, sans-serif',
        fontSize: 16,
        borderRadius: 0,
        padding: '0 10px',
        lineHeight: '42px',
        verticalAlign: 'middle',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        textDecoration: 'none',
        cursor: getCursor(element, cursor),
        ':active': {
          boxShadow: 'inset 0 3px 5px rgba(0,0,0,0.125)'
        },
        ':focus': {
          outline: [ '5px auto -webkit-focus-ring-color', 'thin dotted' ],
          outlineOffset: -2
        }
      },

      primary: {
        borderRadius: theme.borderRadius,
        backgroundColor: theme.primaryColor,
        backgroundRepeat: 'repeat-x',
        borderColor: theme.primaryColor,
        ':hover': {
          backgroundImage: 'none',
          borderColor: '#3b3b3b'
        }
      },

      secondary: {
        borderWidth: 1,
        backgroundImage: 'linear-gradient(rgb(255, 255, 255) 0px, rgb(221, 221, 221) 100%)',
        borderColor: theme.buttonStrokeColor,
        color: theme.darkGray,
        ':hover': {
          backgroundImage: `linear-gradient(to bottom,${theme.lightGray} 0,${theme.lightGray} 100%)`
        }
      },

      tertiary: {
        lineHeight: '35px',
        fontSize: 14,
        backgroundColor: '#fff',
        borderColor: theme.buttonStrokeColor,
        color: theme.darkGray,
        borderWidth: 1,
        ':hover': {
          backgroundColor: theme.lightGray
        }
      },

      block: {
        display: 'block',
        width: '100%'
      },

      disabled: {
        opacity: 0.45,
        ':hover': {},
        ':active': {}
      }
    }

    let style = [
      styles.base,
      kind === 'primary' && styles.primary,
      kind === 'primary' && primaryGradient(theme.primaryColor, theme.darkGray),
      kind === 'secondary' && styles.secondary,
      kind === 'tertiary' && styles.tertiary,
      block && styles.block,
      rest.disabled && styles.disabled
    ]

    return React.createElement(
      element,
      { ...{ style, href, ...rest } },
      children
    )
  }

}

