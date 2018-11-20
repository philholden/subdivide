import {
  CHILD_ABOVE,
  CHILD_BELOW,
  CHILD_LEFT,
  CHILD_RIGHT,
  ROW,
  COL
} from "./constants";
import { createPane } from "./createPane";
import { createLayout } from "./createLayout";
import { secondPass } from "./secondPass";

function getNextId(state) {
  const { panes, allPanesIdsEver } = state;
  if (!allPanesIdsEver) return 1;
  return allPanesIdsEver[allPanesIdsEver.length - 1] * 1 + 1;
  let id = 0;
  while (panes["" + id] !== undefined) {
    id += 1;
  }
  return "" + id;
}

function getDirection(splitType) {
  if (splitType === CHILD_ABOVE || splitType === CHILD_BELOW) return COL;
  if (splitType === CHILD_LEFT || splitType === CHILD_RIGHT) return ROW;
}

function getOffset(splitType) {
  if (splitType === CHILD_ABOVE || splitType === CHILD_LEFT) return 0;
  if (splitType === CHILD_BELOW || splitType === CHILD_RIGHT) return 1;
}

export function setSplitRatio(state, { splitRatio, id }) {
  state.panes[id].splitRatio = splitRatio;
  return state;
}

export function setDividerStyles(
  state,
  { borderColor, cellSpaceColor, borderSize, cellSpacing, touchMargin }
) {
  if (borderColor !== undefined) state.borderColor = borderColor;
  if (cellSpaceColor !== undefined) state.cellSpaceColor = cellSpaceColor;
  if (borderSize !== undefined) state.borderSize = borderSize;
  if (cellSpacing !== undefined) state.cellSpacing = cellSpacing;
  if (touchMargin !== undefined) state.touchMargin = touchMargin;
  return state;
}

export function setSize(state, { width, height }) {
  state.width = width;
  state.height = height;
  return state;
}

export function setCornerDown(state, { cornerDown }) {
  state.cornerDown = cornerDown;
  return state;
}

export function setCornerHover(state, { cornerHover }) {
  state.cornerHover = cornerHover;
  return state;
}

export function setDividerDown(state, { divider }) {
  state.dividerDown = divider;
  return state;
}

export function setPaneProps(state, { id, props }) {
  state.panes[id].props = { ...props };
  return state;
}

function wrapPane(state, id) {
  const { panes } = state;
  const pane = panes[id];
  const { parentId, splitRatio } = pane;
  const parent = panes[parentId];
  const groupId = getNextId(state);
  const group = createPane({
    id: groupId,
    isGroup: true,
    childIds: [id],
    parentId,
    splitRatio
  });

  state.allPanesIdsEver.push(groupId);
  pane.parentId = groupId;
  panes[groupId] = group;
  if (parent) {
    const childIds = parent.childIds;
    childIds[childIds.indexOf(id)] = groupId;
  }
  return { state, group };
}

function removePane(state, id) {
  //splice pane out of parents childIds
  const { panes } = state;
  const pane = panes[id];
  const parent = panes[pane.parentId];
  if (!parent) return state;
  const { childIds } = parent;
  childIds.splice(childIds.indexOf(id), 1);

  if (childIds.length === 1) {
    const remainingPane = panes[childIds[0]];
    if (parent.id === state.rootId) {
      state.rootId = remainingPane.id;
      remainingPane.parentId = undefined;
    } else {
      const grandparentId = parent.parentId;
      const grandparent = panes[grandparentId];
      const grandchildIds = grandparent.childIds;
      grandchildIds[grandchildIds.indexOf(parent.id)] = remainingPane.id;
      remainingPane.parentId = grandparentId;
    }
    delete panes[parent.id];
    remainingPane.direction = undefined;
  }
  delete panes[id];
  return state;
}

export function split(state, { id, splitType, startX, startY }) {
  if (state.cornerDown === undefined) return;
  const { panes, rootId } = state;
  const pane = panes[id];
  const oldPane = pane;
  const oldParentId = pane.parentId;
  let parent = panes[oldParentId];
  const isRoot = id === rootId;
  const direction = getDirection(splitType);
  if (!parent || parent.direction !== direction) {
    const { group } = wrapPane(state, id);
    parent = group;
    parent.direction = direction;
    // state = wrappedState.state;
    if (isRoot) {
      state.rootId = parent.id;
    }
    pane.splitRatio = 1;
  }
  const { childIds } = parent;
  const index = childIds.indexOf(id);
  const newPane = createPane({
    id: getNextId(state),
    parentId: parent.id,
    splitRatio: 0.2
  });
  const offset = getOffset(splitType);
  childIds.splice(index + offset, 0, newPane.id);
  const beforePaneId = offset === 1 ? pane.id : newPane.id;
  const afterPaneId = offset === 1 ? newPane.id : pane.id;
  let ratio =
    direction === ROW
      ? (startX - oldPane.left) / oldPane.width
      : (startY - oldPane.top) / oldPane.height;

  ratio = offset ? ratio : 1 - ratio;

  let ratioA = ratio;
  let ratioB = 1 - ratioA;
  if (newPane.parentId === oldParentId) {
    ratioA *= oldPane.splitRatio;
    ratioB *= oldPane.splitRatio;
  }
  pane.splitRatio = ratioA;
  newPane.splitRatio = ratioB;
  state.allPanesIdsEver.push(newPane.id);
  panes[parent.id] = parent;
  panes[newPane.id] = newPane;
  state.cornerDown = undefined;
  secondPass(state);
  state.dividerDown = {
    ...state.dividers[`${beforePaneId}n${afterPaneId}`],
    startX,
    startY
  };
  return state;
}

export function join(state, { retainId, removeId }) {
  const remove = state.panes[removeId];
  if (remove.isGroup) {
    return state;
  }
  const retain = state.panes[retainId];
  const parent = state.panes[retain.parentId];
  const siblings = parent.childIds;
  const pos = [retainId, removeId].map(id => siblings.indexOf(id));
  if (
    pos[1] === -1 ||
    pos[0] === -1 ||
    !(pos[0] + 1 === pos[1] || pos[0] - 1 === pos[1])
  ) {
    console.warn("pane must be adjacent to join");
    return state;
  }
  removePane(state, removeId);

  const nextParentId = state.panes[retainId].parentId;
  const splitRatio =
    parent.id === nextParentId
      ? remove.splitRatio + retain.splitRatio
      : parent.splitRatio;

  state.panes[retain.id].splitRatio = splitRatio;

  return state;
}
