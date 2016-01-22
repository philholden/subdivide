import React from 'react'
import {
  COL
} from '../constants'
import DividerTouch from './DividerTouch'

let Rect = (props) => {
  let { style } = props
  const { left, top } = props.style
  style = {
    ...{},
    ...style,
    transform: `translate3d(${left}px,${top}px,0)`,
    position: 'absolute',
    top: 0,
    left: 0
  }
  return <div {...props} style={style}></div>
}

let Dividers = (props) => {
  const { dividers, subdivide, actions } = props
  const { borderSize } = subdivide
  //let touch = dividers.map(touch).toSeq()
  let toBorder = (divider) => {
    const { width, height, top, left, id } = divider
    let style = {
      width,
      height,
      top,
      left,
      backgroundColor: '#c0c0d0'
    }

    return <Rect style={style} key={id} />
  }

  let toInner = (divider) => {
    const { width, height, top, left, id, direction } = divider
    let style
    if (direction === COL) {
      style = {
        width: width + borderSize * 2,
        height: height - borderSize * 2,
        top: top + borderSize,
        left: left - borderSize,
        backgroundColor: '#e0e0f0'
      }
    } else {
      style = {
        width: width - borderSize * 2,
        height: height + borderSize * 2,
        top: top - borderSize,
        left: left + borderSize,
        backgroundColor: '#e0e0f0'
      }
    }

    if (style.left < 0) {
      style.width = style.width + style.left
      style.left = 0
    }
    style.width = Math.min(style.width, subdivide.width - style.left)
    if (style.top < 0) {
      style.height = style.height + style.top
      style.top = 0
    }
    style.height = Math.min(style.height, subdivide.height - style.top)

    return <Rect style={style} key={id} />
  }

  let toTouch = (divider) => {
    return <DividerTouch
              divider={divider}
              subdivide={subdivide}
              actions={actions}
              key={divider.id}
            />
  }

  return (
    <div>
      {dividers.toList().map(toBorder)}
      {dividers.toList().map(toInner)}
      {dividers.toList().map(toTouch)}
    </div>
  )
}

export default Dividers
