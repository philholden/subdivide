import {
  ROW,
  COL
} from '../constants/BlenderLayoutConstants';

export function getParent({pane, layout}) {
  return layout.panes.get(pane.parentId);
}

// export function getSiblings({pane, layout}) {
//   const parent = getParent({pane, layout});
//   if (!parent) return [pane];
//   return parent.childIds.map(
//     id => layout.panes.get(id)
//   ).toJS();
// }

export function getSiblingIds({pane, layout}) {
  const parent = getParent({pane, layout});
  if (!parent) return [pane];
  return parent.childIds;
}

export function canJoin({pane, layout}, retainId) {
  const retain = layout.panes.get(retainId);
  const remove = layout.panes.get(pane.id);

  if (remove.childIds.size === 0 && retain.childIds.size === 0) {
    const siblings = getSiblingIds({pane, layout});
    const index1 = siblings.indexOf(pane.id);
    const index2 = siblings.indexOf(retainId);
    return (index2 !== -1 && Math.abs(index1 - index2) === 1);
  }
  return false;
}

export function getAdjacent({pane, layout}) {
  const siblings = getSiblingIds({pane, layout});
  const index = siblings.indexOf(pane.id);
  const adjacentId = siblings.get(index - 1);
  const adjacent = layout.panes.get(adjacentId).toJS();
  adjacent.hasDivider = index > 1;
  return adjacent;
}

export function shouldDisplayDivider({pane, layout}) {
  if (layout.rootId === pane.id) return false;
  const {id, parentId} = pane;
  const parent = layout.panes.get(parentId);
  const siblings = parent.childIds;
  const isFirst = siblings.first() === id;
  return !isFirst;
}

export function getSizes({pane, layout}, parentWidth, parentHeight) {
  const {splitRatio} = pane;
  const parent = layout.panes.get(pane.parentId);
  let {dividerSize} = layout;
  const displayDivider = shouldDisplayDivider({pane, layout});
  if (!displayDivider) dividerSize = 0;

  let width = parentWidth;
  let height = parentHeight;
  let dividerWidth = parentWidth;
  let dividerHeight = parentHeight;
  let contentWidth = parentWidth;
  let contentHeight = parentHeight;
  //let adjacentSize;
  //let adjacent;
  let parentSize;
  if (parent && parent.isGroup) {
    //adjacent = getAdjacent({pane, layout});
    if (parent.direction === ROW) {
      width = splitRatio * parentWidth;
      dividerWidth = dividerSize;
      contentWidth = width - dividerSize;
      //adjacentSize = width + adjacent.splitRatio * parentWidth;
      parentSize = parentWidth;
    }
    if (parent.direction === COL) {
      height = splitRatio * parentHeight;
      dividerHeight = dividerSize;
      contentHeight = height - dividerSize;
      //adjacentSize = height + adjacent.splitRatio * parentHeight;
      parentSize = parentHeight;
    }
  //  if (adjacent.hasDivider) adjacentSize -= dividerSize;
  }

  return {
    width,
    height,
    dividerWidth,
    dividerHeight,
    contentWidth,
    contentHeight,
    parentSize,
    parentHeight,
    parentWidth,
    direction: parent && parent.direction
  };
}
