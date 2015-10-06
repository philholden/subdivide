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
  JOIN_DOWN_ARROW,
} from '../constants';

import {Divider} from '../reducers';
import {Map} from 'immutable';

function getJoinDirection({subdivide, pane}) {
  const {cornerDown} = subdivide;
  if (cornerDown === undefined) return false;
  const cornerDownId = subdivide.cornerDown.id;
  const cornerDownPane = subdivide.panes.get(cornerDownId);
  const parent = subdivide.panes.get(cornerDownPane.parentId);
  if (!parent) return false;
  const siblings = parent.childIds;
  const index = siblings.indexOf(cornerDownId);
  const beforeId = index < 1 ? undefined : siblings.get(index - 1);
  const afterId = siblings.get(index + 1);
  const isBeforeGroup = beforeId !== undefined && subdivide.panes.get(beforeId).isGroup;
  const isAfterGroup = afterId !== undefined && subdivide.panes.get(afterId).isGroup;
  const canJoinBefore = beforeId === pane.id && !isBeforeGroup;
  const canJoinAfter = afterId === pane.id && !isAfterGroup;

  return (
    cornerDown.corner === NE && (
      (parent.direction === COL && canJoinBefore && JOIN_UP_ARROW) ||
      (parent.direction === ROW && canJoinAfter && JOIN_RIGHT_ARROW)
    )
  ) || (
    cornerDown.corner === SW && (
      (parent.direction === COL && canJoinAfter && JOIN_DOWN_ARROW) ||
      (parent.direction === ROW && canJoinBefore && JOIN_LEFT_ARROW)
    )
  ) || (
    cornerDown.corner === NW && (
      (parent.direction === COL && canJoinBefore && JOIN_UP_ARROW) ||
      (parent.direction === ROW && canJoinBefore && JOIN_LEFT_ARROW)
    )
  ) || (
    cornerDown.corner === SE && (
      (parent.direction === COL && canJoinAfter && JOIN_DOWN_ARROW) ||
      (parent.direction === ROW && canJoinAfter && JOIN_RIGHT_ARROW)
    )
  );
}

export default function secondPass(state) {
  let dividerMap = Map();

  const {rootId, width, height} = state;
  const left = 0;
  const top = 0;
  let rootPane = state.panes.get(rootId);

  const {cellSpacing, cornerDown} = state;

  rootPane = rootPane.merge({
    width,
    height,
    top,
    left,
    canSplit: cornerDown && cornerDown.id === rootId
  });

  state = state.mergeIn(['panes', rootId], rootPane);

  let flattenChildren = (parent) => {
    let x = parent.left;
    let y = parent.top;
    let spacingOffset;
    let hasDivider = false;
    let beforePaneId;
    let divider;
    let beforeRatio;

    parent.childIds.forEach((childId, i) => {
      let child = state.panes.get(childId);
      let canSplit = cornerDown && cornerDown.id === childId;
      let joinDirection = getJoinDirection({subdivide: state, pane: child});

      child = child.merge({canSplit, joinDirection});

      hasDivider = i !== 0;
      spacingOffset = 0;
      if (hasDivider) {
        spacingOffset = cellSpacing;
        divider = {
          left: x,
          top: y,
          beforePaneId: beforePaneId,
          afterPaneId: child.id,
          beforeRatio: beforeRatio,
          afterRatio: child.splitRatio,
          direction: parent.direction,
          parentSize: parent.direction === ROW ? parent.width : parent.height,
          id: beforePaneId + 'n' + child.id
        };
      }

      if (parent.direction === ROW) {
        if (hasDivider) {
          divider.width = cellSpacing;
          divider.height = parent.height;
          dividerMap = dividerMap.set(divider.id, new Divider(divider));
          // state = state.setIn(['dividers', divider.id],
          //     new Divider(divider));
          x += cellSpacing;
        }
        child = child.merge({
          width: parent.width * child.splitRatio - spacingOffset,
          height: parent.height,
          left: x,
          top: y
        });
        x += child.width;
      } else if (parent.direction === COL) {
        if (hasDivider) {
          divider.width = parent.width;
          divider.height = cellSpacing;
          dividerMap = dividerMap.set(divider.id, new Divider(divider));
          // state = state.setIn(['dividers', divider.id],
          //     new Divider(divider));
          y += cellSpacing;
        }
        child = child.merge({
          width: parent.width,
          height: parent.height * child.splitRatio - spacingOffset,
          left: x,
          top: y
        });
        y += child.height;
      }

      beforePaneId = child.id;
      beforeRatio = child.splitRatio;
      state = state.mergeIn(['panes', childId], child);
      if (child.isGroup) {
        flattenChildren(child);
      }
    });
  };
  flattenChildren(rootPane);
  state = state.set('dividers', dividerMap);
  return state;
}


