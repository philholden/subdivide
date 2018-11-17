import React, { useEffect, useRef, forwardRef, useCallback } from "react";
import { Pane } from "./Pane";
import { Dividers } from "./Dividers";
import AnimationFrame from "./AnimationFrame";
import {
  CHILD_ABOVE,
  CHILD_BELOW,
  CHILD_LEFT,
  CHILD_RIGHT,
  ROW,
  SW,
  NE,
  SE,
  NW
} from "../reducer/constants";
import ResizeObserver from "resize-observer-polyfill";

export const Layout = forwardRef((props, ref) => {
  const propsRef = useRef();
  const resizeEl = useRef();
  const offset = useRef({ x: 0, y: 0 });
  propsRef.current = props;

  const onResize = useCallback(
    entries => {
      const { x, y } = entries[0].target.getBoundingClientRect();
      offset.current = { x, y };
      const { width, height } = entries[0].contentRect;
      props.actions.setSize(width, height);
    },
    [resizeEl.current]
  );

  useEffect(
    () => {
      if (!resizeEl.current) {
        return;
      }
      // if (typeof ref === "function") {
      //   ref(resizeEl.current);
      // }
      const resizeObserver = new ResizeObserver(onResize);
      resizeObserver.observe(resizeEl.current);
      return () => {
        resizeObserver.unobserve(resizeEl.current);
      };
    },
    [resizeEl.current]
  );

  useEffect(() => {
    const props = propsRef.current;
    const animationFrame = new AnimationFrame();

    // const { setSize } = props.actions;
    const onMouseMove = animationFrame.throttle(e => {
      const { actions, store: subdivide } = props;
      // const { clientX, clientY } = e;
      const clientX = e.clientX - offset.current.x;
      const clientY = e.clientY - offset.current.y;

      if (subdivide.dividerDown) {
        e.preventDefault();
        const divider = subdivide.dividerDown;
        const {
          beforePaneId,
          afterPaneId,
          direction,
          parentSize,
          startX,
          startY
        } = divider;

        let delta = direction === ROW ? clientX - startX : clientY - startY;
        let deltaRatio = delta / parentSize;
        let afterRatio = divider.afterRatio - deltaRatio;
        let beforeRatio = divider.beforeRatio + deltaRatio;
        if (beforeRatio * parentSize > 20 && afterRatio * parentSize > 20) {
          actions.setSplitRatio(beforePaneId, beforeRatio);
          actions.setSplitRatio(afterPaneId, afterRatio);
        }
      }

      if (subdivide.cornerDown) {
        const pane = subdivide.cornerDown;
        const { split } = actions;
        const { width, height, left, top, id, corner } = pane;

        if (
          clientX > left &&
          clientX < left + width &&
          clientY > top &&
          clientY < top + height
        ) {
          if (corner === SW) {
            if (clientX - left > 25) {
              split(id, CHILD_LEFT, clientX, clientY);
            } else if (top + height - clientY > 25) {
              split(id, CHILD_BELOW, clientX, clientY);
            }
          }

          if (corner === NE) {
            if (left + width - clientX > 25) {
              split(id, CHILD_RIGHT, clientX, clientY);
            } else if (clientY - top > 25) {
              split(id, CHILD_ABOVE, clientX, clientY);
            }
          }

          if (corner === SE) {
            if (left + width - clientX > 25) {
              split(id, CHILD_RIGHT, clientX, clientY);
            } else if (top + height - clientY > 25) {
              split(id, CHILD_BELOW, clientX, clientY);
            }
          }

          if (corner === NW) {
            if (clientX - left > 25) {
              split(id, CHILD_LEFT, clientX, clientY);
            } else if (clientY - top > 25) {
              split(id, CHILD_ABOVE, clientX, clientY);
            }
          }
        }
      }
    }, []);

    function onMouseUp() {
      const { actions, store: subdivide } = props;
      if (subdivide.dividerDown) {
        actions.setDividerDown(undefined);
      }
      // give pane onMouseUp a chance to fire
      setTimeout(() => {
        if (subdivide.cornerDown) {
          actions.setCornerDown(undefined);
        }
      }, 10);
    }

    // window.addEventListener("resize", () => {
    //   setSize(window.innerWidth, window.innerHeight);
    // });

    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mousemove", onMouseMove);

    //setSize(window.innerWidth, window.innerHeight);
    return animationFrame.stop;
  }, []);

  const { store: subdivide, actions, DefaultComponent, iframeSafe } = props;
  let panes;
  if (iframeSafe) {
    panes = subdivide.allPanesIdsEver.map(id => {
      const pane = subdivide.panes[id];
      return (
        <Pane
          subdivide={subdivide}
          pane={pane}
          actions={actions}
          key={"pane" + id}
          DefaultComponent={DefaultComponent}
        />
      );
    });
  } else {
    panes = subdivide.panes
      .filter(pane => !pane.isGroup)
      .map(pane => {
        return (
          <Pane
            subdivide={subdivide}
            pane={pane}
            actions={actions}
            key={pane.id}
            DefaultComponent={DefaultComponent}
          />
        );
      });
  }

  const { style = { width: "100vw", height: "100vh" } } = props;
  return (
    <div ref={resizeEl} style={style}>
      {panes}
      <Dividers
        dividers={subdivide.dividers}
        subdivide={subdivide}
        actions={actions}
      />
    </div>
  );
});

Layout.defaultProps = {
  iframeSafe: true
};
