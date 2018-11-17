import React, { useEffect } from "react";
import { COL } from "../reducer/constants";

export function DividerTouch(props) {
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
        <div style={styles.inner} />
      </div>
    </div>
  );
}

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
