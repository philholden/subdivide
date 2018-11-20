import React, { memo, useRef } from "react";
import { Triangle } from "./Triangle";
import CornerOverlay from "./CornerOverlay";
import { PaneProvider } from "./usePane";

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

export const Pane = memo(
  ({ pane, subdivide, actions, DefaultComponent }) => {
    const renders = useRef(0);
    renders.current++;
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
      <PaneProvider value={pane}>
        <div style={styles.pane} onMouseUp={onMouseUp}>
          <DefaultComponent
            subdividePane={pane}
            subdivideActions={actions}
            subdivide={subdivide}
          />
          <CornerOverlay pane={pane} subdivide={subdivide} />
          {renders.current && false}
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
      </PaneProvider>
    );
  },
  (old, props) =>
    false &&
    old.pane.width === props.pane.width &&
    old.pane.height === props.pane.height &&
    old.pane.top === props.pane.top &&
    old.pane.direction === props.pane.direction &&
    old.pane.left === props.pane.left &&
    old.pane.isGroup === props.pane.isGroup &&
    old.pane.id === props.pane.id &&
    old.pane.joinDirection === props.pane.joinDirection &&
    //  old.subdivide.touchMargin === props.subdivide.touchMargin &&
    old.subdivide.dividerDown === props.subdivide.dividerDown &&
    old.subdivide.width === props.subdivide.width &&
    old.subdivide.height === props.subdivide.height
);
