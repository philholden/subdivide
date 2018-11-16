import React from "react";
import { COL } from "../reducer/constants";
import { DividerTouch } from "./DividerTouch";
import { useSubdivide } from "./useSubdivide";

function Rect(props) {
  let { style } = props;
  const { left, top } = props.style;
  style = {
    ...{},
    ...style,
    transform: `translate3d(${left}px,${top}px,0)`,
    position: "absolute",
    top: 0,
    left: 0
  };
  return <div {...props} style={style} />;
}

export function Dividers(props) {
  const {
    state: { borderColor, cellSpaceColor }
  } = useSubdivide();
  const { dividers, subdivide, actions } = props;
  const { borderSize } = subdivide;
  //let touch = dividers.map(touch).toSeq()
  function toBorder(divider) {
    const { width, height, top, left, id } = divider;
    let style = {
      width,
      height,
      top,
      left,
      backgroundColor: borderColor
    };

    return <Rect style={style} key={"r" + id} />;
  }

  function toInner(divider) {
    const { width, height, top, left, id, direction } = divider;
    let style;
    if (direction === COL) {
      style = {
        width: width + borderSize * 2,
        height: height - borderSize * 2,
        top: top + borderSize,
        left: left - borderSize,
        backgroundColor: cellSpaceColor
      };
    } else {
      style = {
        width: width - borderSize * 2,
        height: height + borderSize * 2,
        top: top - borderSize,
        left: left + borderSize,
        backgroundColor: cellSpaceColor
      };
    }

    if (style.left < 0) {
      style.width = style.width + style.left;
      style.left = 0;
    }
    style.width = Math.min(style.width, subdivide.width - style.left);
    if (style.top < 0) {
      style.height = style.height + style.top;
      style.top = 0;
    }
    style.height = Math.min(style.height, subdivide.height - style.top);

    return <Rect style={style} key={"r2" + id} />;
  }

  function toTouch(divider) {
    return (
      <DividerTouch
        divider={divider}
        subdivide={subdivide}
        actions={actions}
        key={divider.id}
      />
    );
  }

  const dividerList = Object.values(dividers);

  return (
    <div>
      {dividerList.map(toBorder)}
      {dividerList.map(toInner)}
      {dividerList.map(toTouch)}
    </div>
  );
}
