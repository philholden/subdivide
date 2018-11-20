import React from "react";

import { SW, NE, SE, NW } from "../reducer/constants";

export function Triangle(props) {
  function onMouseDown(e) {
    e.preventDefault();
    const { actions, corner, pane } = props;
    // if (!subdivide.cornerDown) return;
    actions.setCornerDown({ ...pane, corner });
  }

  function onMouseEnter() {
    const { actions, corner, pane } = props;
    actions.setCornerHover({
      paneId: pane.id,
      corner
    });
  }

  function onMouseLeave() {
    const { actions } = props;
    actions.setCornerHover(undefined);
  }

  const styles = getStyles(props);

  return (
    <div
      key="outer"
      style={styles.outer}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div style={styles.inner} />
    </div>
  );
}

function getStyles(props) {
  const { corner, color, size, subdivide, pane } = props;
  const { cornerHover } = subdivide;
  const offset = (size + 3) / 2;
  let outer = {
    width: size,
    height: size,
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0)",
    opacity: 1,
    display: subdivide.dividerDown ? "none" : "block"
  };

  if (corner === NE) {
    outer = {
      ...outer,
      top: 0,
      right: 0,
      cursor: "grab",
      transform: `translate3d(${offset}px, ${-offset}px, 0) rotate(225deg)`
    };
  } else if (corner === SW) {
    outer = {
      ...outer,
      bottom: 0,
      left: 0,
      cursor: "grab",
      transform: `translate3d(${-offset}px,${offset}px, 0) rotate(45deg)`
    };
  } else if (corner === SE) {
    outer = {
      ...outer,
      bottom: 0,
      right: 0,
      cursor: "grab",
      transform: `translate3d(${offset}px,${offset}px, 0) rotate(315deg)`
    };
  } else if (corner === NW) {
    outer = {
      ...outer,
      top: 0,
      left: 0,
      cursor: "grab",
      transform: `translate3d(${-offset}px,${-offset}px, 0) rotate(135deg)`
    };
  }

  const hover =
    cornerHover &&
    cornerHover.paneId === pane.id &&
    cornerHover.corner === corner
      ? 0
      : offset;

  const inner = {
    border: "1px solid #c0c0d0",
    backgroundColor: color,
    width: "100%",
    height: "100%",
    transform: `translate3d(0,${hover}px,0)`,
    transition: "transform .1s"
  };

  return { outer, inner };
}
