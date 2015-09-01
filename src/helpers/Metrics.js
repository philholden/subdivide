import {
  ROW,
  COL
} from '../constants/BlenderLayoutConstants';

export function shouldDisplayDivider({pane, layout}) {
  if (layout.rootId === pane.id) return false;
  const {id, parentId} = pane;
  const parent = layout.panes.get(parentId);
  const siblings = parent.childIds;
  const isFirst = siblings.first() === id;
  return !isFirst;
}

export function getSizes({pane, layout}, parentWidth, parentHeight) {
  console.log(pane.toJS());
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
  if (parent && parent.isGroup) {
    if (parent.direction === ROW) {
      width = splitRatio * parentWidth;
      dividerWidth = dividerSize;
      contentWidth = width - dividerSize;
    }
    if (parent.direction === COL) {
      height = splitRatio * parentHeight;
      dividerHeight = dividerSize;
      contentHeight = height - dividerSize;
    }
  }

  return {
    width,
    height,
    dividerWidth,
    dividerHeight,
    contentWidth,
    contentHeight,
    direction: parent && parent.direction
  };
}
