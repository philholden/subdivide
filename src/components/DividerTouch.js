import React, { useEffect, memo, useRef } from "react";
import { COL } from "../reducer/constants";

export const DividerTouch = memo(
  props => {
    const renders = useRef(0);
    renders.current++;
    const { actions, divider, resizeEl } = props;

    function onMouseUp() {
      actions.setDividerDown(undefined);
      removeListeners();
    }

    function removeListeners() {
      document.removeEventListener("mouseup", onMouseUp);
    }

    function onMouseDown({ clientX, clientY }) {
      const rect = resizeEl.current.getBoundingClientRect();
      actions.setDividerDown({
        ...divider,
        startX: clientX - rect.x,
        startY: clientY - rect.y
      });
      document.addEventListener("mouseup", onMouseUp);
    }

    useEffect(() => removeListeners, ["once"]);

    const styles = dividerStyle(props);

    return (
      <div style={styles.touch} onMouseDown={onMouseDown} className="divider">
        <div style={styles.border}>
          {renders.current && false}
          <div style={styles.inner} />
        </div>
      </div>
    );
  },
  (old, props) =>
    old.divider.width === props.divider.width &&
    old.divider.height === props.divider.height &&
    old.divider.top === props.divider.top &&
    old.divider.direction === props.divider.direction &&
    old.divider.left === props.divider.left &&
    old.subdivide.touchMargin === props.subdivide.touchMargin
);

function dividerStyle(props) {
  const { width, height, top, left, direction } = props.divider;
  const { touchMargin } = props.subdivide;
  let touch = {
    width,
    height,
    top,
    left,
    //     backgroundColor: 'rgba(0,0,0,0.5)',
    position: "absolute"
  };

  if (direction === COL) {
    touch.cursor = "row-resize";
    touch.top -= touchMargin;
    touch.height += touchMargin * 2;
  } else {
    touch.cursor = "col-resize";
    touch.left -= touchMargin;
    touch.width += touchMargin * 2;
  }

  return { touch };
}
