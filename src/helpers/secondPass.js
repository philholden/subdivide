import {
  ROW,
  COL,
  NE,
  SW,
  JOIN_RIGHT_ARROW,
  JOIN_UP_ARROW,
  JOIN_LEFT_ARROW,
  JOIN_DOWN_ARROW,
} from '../constants/BlenderLayoutConstants';

import {Divider} from '../reducers/LayoutReducer';
import {Map} from 'immutable';

function getJoinDirection({layout, pane}) {
  const {cornerDown} = layout;
  if (cornerDown === undefined) return false;
  const cornerDownId = layout.cornerDown.id;
  const cornerDownPane = layout.panes.get(cornerDownId);
  const parent = layout.panes.get(cornerDownPane.parentId);
  if (!parent) return false;
  const siblings = parent.childIds;
  const index = siblings.indexOf(cornerDownId);
  const beforeId = siblings.get(index - 1);
  const afterId = siblings.get(index + 1);
  const isBeforeGroup = beforeId !== undefined && layout.panes.get(beforeId).isGroup;
  const isAfterGroup = afterId !== undefined && layout.panes.get(afterId).isGroup;
  const canJoinBefore = beforeId === pane.id && !isBeforeGroup;
  const canJoinAfter = afterId === pane.id && !isAfterGroup;
  return (
    cornerDown.corner === NE && (
      (parent.direction === ROW && canJoinAfter && JOIN_RIGHT_ARROW) ||
      (parent.direction === COL && canJoinBefore && JOIN_UP_ARROW)
    )
  ) || (
    cornerDown.corner === SW && (
      (parent.direction === COL && canJoinAfter && JOIN_DOWN_ARROW) ||
      (parent.direction === ROW && canJoinBefore && JOIN_LEFT_ARROW)
    )
  );
}

export default function secondPass(state) {
  let dividerMap = Map();

  const {rootId, width, height} = state;
  const left = 0;
  const top = 0;
  let rootPane = state.panes.get(rootId);

  const {cellSpacing, touchMargin, borderSize} = state;
  const dividerSize = cellSpacing + (touchMargin * 2);

  rootPane = rootPane.merge({
    width,
    height,
    top,
    left
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
      let {cornerDown} = state;
      let canSplit = cornerDown && cornerDown.id === childId;
      let joinDirection = getJoinDirection({layout: state, pane: child});

      child = child.merge({canSplit, joinDirection});

      hasDivider = i !== 0;
      spacingOffset = 0;
      if (hasDivider) {
        spacingOffset = cellSpacing;
        divider = {
          borderSize: borderSize,
          touchMargin: touchMargin,
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
          divider.left = x - touchMargin;
          divider.width = dividerSize;
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
          divider.top = y - touchMargin;
          divider.width = parent.width;
          divider.height = dividerSize;
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


