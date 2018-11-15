import React, { Component } from "react";
import { Triangle } from "./Triangle";
import CornerOverlay from "./CornerOverlay";

import { NE, SW, SE, NW } from "../reducer/constants";

function getStyles({ width, height, top, left }) {
  return {
    pane: {
      position: "absolute",
      width: width + "px",
      height: height + "px",
      top: top + "px",
      left: left + "px",
      overflow: "hidden"
    }
  };
}

export function Pane({ pane, subdivide, actions, DefaultComponent }) {
  function onMouseUp() {
    //Note this on mouse up happens after subdivide on mouse up
    const { join } = actions;
    if (!subdivide.cornerDown) return;
    const cornerDownId = subdivide.cornerDown.id;
    if (pane.joinDirection) {
      join(cornerDownId, pane.id);
      actions.setCornerDown(undefined);
    }
  }

  if (pane === undefined) {
    return <div style={{ visibility: "hidden" }} />;
  }

  if (pane.isGroup) {
    return null;
  }

  const styles = getStyles(pane);

  return (
    <div style={styles.pane} onMouseUp={onMouseUp}>
      <DefaultComponent
        subdividePane={pane}
        subdivideActions={actions}
        subdivide={subdivide}
      />
      <CornerOverlay pane={pane} subdivide={subdivide} />
      <Triangle
        corner={SW}
        color="#dadadf"
        size={42}
        subdivide={subdivide}
        pane={pane}
        actions={actions}
      />
      <Triangle
        corner={NE}
        color="#dadadf"
        size={42}
        subdivide={subdivide}
        pane={pane}
        actions={actions}
      />
      <Triangle
        corner={NW}
        color="#dadadf"
        size={42}
        subdivide={subdivide}
        pane={pane}
        actions={actions}
      />
      <Triangle
        corner={SE}
        color="#dadadf"
        size={42}
        subdivide={subdivide}
        pane={pane}
        actions={actions}
      />
    </div>
  );
}
