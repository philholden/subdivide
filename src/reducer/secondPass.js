import {
  ROW,
  COL,
  NE,
  SW,
  NW,
  SE,
  JOIN_RIGHT_ARROW,
  JOIN_UP_ARROW,
  JOIN_LEFT_ARROW,
  JOIN_DOWN_ARROW
} from "./constants";

function getJoinDirection(state, pane) {
  const { cornerDown } = state;
  if (cornerDown === undefined) return false;
  const cornerDownId = state.cornerDown.id;
  const cornerDownPane = state.panes[cornerDownId];
  const parent = state.panes[cornerDownPane.parentId];
  if (!parent) return false;
  const siblings = parent.childIds;
  const index = siblings.indexOf(cornerDownId);
  const beforeId = index < 1 ? undefined : siblings[index - 1];
  const afterId = siblings[index + 1];
  const isBeforeGroup = beforeId !== undefined && state.panes[beforeId].isGroup;
  const isAfterGroup = afterId !== undefined && state.panes[afterId].isGroup;
  const canJoinBefore = beforeId === pane.id && !isBeforeGroup;
  const canJoinAfter = afterId === pane.id && !isAfterGroup;

  return (
    (cornerDown.corner === NE &&
      ((parent.direction === COL && canJoinBefore && JOIN_UP_ARROW) ||
        (parent.direction === ROW && canJoinAfter && JOIN_RIGHT_ARROW))) ||
    (cornerDown.corner === SW &&
      ((parent.direction === COL && canJoinAfter && JOIN_DOWN_ARROW) ||
        (parent.direction === ROW && canJoinBefore && JOIN_LEFT_ARROW))) ||
    (cornerDown.corner === NW &&
      ((parent.direction === COL && canJoinBefore && JOIN_UP_ARROW) ||
        (parent.direction === ROW && canJoinBefore && JOIN_LEFT_ARROW))) ||
    (cornerDown.corner === SE &&
      ((parent.direction === COL && canJoinAfter && JOIN_DOWN_ARROW) ||
        (parent.direction === ROW && canJoinAfter && JOIN_RIGHT_ARROW)))
  );
}

export function secondPass(state) {
  const dividers = {};

  const { rootId, width, height } = state;
  const left = 0;
  const top = 0;
  const { panes } = state;
  let rootPane = state.panes[rootId];

  const { cellSpacing, cornerDown } = state;

  Object.assign(rootPane, {
    width,
    height,
    top,
    left,
    canSplit: cornerDown && cornerDown.id === rootId
  });

  panes.rootId = rootPane;

  function round(n, i) {
    return n === 0.5 ? (i % 2 === 0 ? n - 0.5 : n + 0.5) : Math.round(n);
  }

  let flattenChildren = parent => {
    let x = parent.left;
    let y = parent.top;
    let spacingOffset;
    let hasDivider = false;
    let beforePaneId;
    let divider;
    let beforeRatio;
    let xOffcuts = 0;
    let yOffcuts = 0;

    parent.childIds.forEach((childId, i) => {
      const child = panes[childId];
      const canSplit = cornerDown && cornerDown.id === childId;
      const joinDirection = getJoinDirection(state, child);

      Object.assign(child, { canSplit, joinDirection });

      hasDivider = i !== 0;
      spacingOffset = 0;
      if (hasDivider) {
        spacingOffset = cellSpacing;
        divider = {
          left: x,
          top: y,
          beforePaneId,
          afterPaneId: child.id,
          beforeRatio,
          afterRatio: child.splitRatio,
          direction: parent.direction,
          parentSize: parent.direction === ROW ? parent.width : parent.height,
          id: beforePaneId + "n" + child.id
        };
      }

      if (parent.direction === ROW) {
        if (hasDivider) {
          divider.width = cellSpacing;
          divider.height = parent.height;
          dividers[divider.id] = divider;
          x += cellSpacing;
        }
        const pos = parent.width * child.splitRatio - spacingOffset + xOffcuts;
        xOffcuts = pos % 1;
        Object.assign(child, {
          width: i === parent.childIds.length - 1 ? Math.round(pos) : pos | 0,
          // width: parent.width * child.splitRatio - spacingOffset,
          height: parent.height,
          left: x,
          top: y
        });
        x += child.width;
      } else if (parent.direction === COL) {
        if (hasDivider) {
          divider.width = parent.width;
          divider.height = cellSpacing;
          dividers[divider.id] = divider;
          y += cellSpacing;
        }
        const pos = parent.height * child.splitRatio - spacingOffset + yOffcuts;
        yOffcuts = pos % 1;
        Object.assign(child, {
          width: parent.width,
          height: i === parent.childIds.length - 1 ? Math.round(pos) : pos | 0,
          // height: parent.height * child.splitRatio - spacingOffset,
          left: x,
          top: y
        });
        y += child.height;
      }

      beforePaneId = child.id;
      beforeRatio = child.splitRatio;

      if (child.isGroup) {
        flattenChildren(child);
      }
    });
  };
  flattenChildren(rootPane);
  state.dividers = dividers;
  return state;
}
