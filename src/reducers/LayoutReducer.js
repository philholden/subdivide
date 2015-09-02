import {
  SPLIT,
  JOIN,
  SET_SPLIT_RATIO,
  SET_SIZE,
  CHILD_ABOVE,
  CHILD_BELOW,
  CHILD_LEFT,
  CHILD_RIGHT,
  ROW,
  COL,
  SET_MODE
} from '../constants/BlenderLayoutConstants';

import { Record, List, Map} from 'immutable';
import {getAdjacent} from '../helpers/Metrics';

export const Pane = new Record({
  id: '0',
  childIds: List(),
  isGroup: false,
  direction: undefined,
  parentId: undefined,
  splitRatio: 1
});

export const Layout = new Record({
  rootId: '0',
  dividerSize: 3,
  mode: undefined,
  splitJoinId: undefined,
  splitStartX: undefined,
  splitStartY: undefined,
  width: 800,
  height: 600,
  panes: Map({
    '0': new Pane()
  })
});

const initialState = new Layout();

function getNextId(state) {
  return (
    state
      .get('panes')
      .map(pane => parseInt(pane.id))
      .max() + 1
  ) + '';
}

function wrapPane(state, id) {
  let pane = state.panes.get(id);
  let parent = state.panes.get(pane.parentId);
  let parentId = pane.parentId;
  let groupId = getNextId(state);
  let group = new Pane({
    id: groupId,
    isGroup: true,
    childIds: List([id]),
    parentId: pane.parentId,
    splitRatio: pane.splitRatio
  });
  pane = pane.set('parentId', groupId);
  state = state.setIn(['panes', id], pane);
  state = state.setIn(['panes', groupId], group);
  if (parent) {
    let childIds = parent.childIds;
    childIds = childIds.set(childIds.indexOf(id), groupId);
    console.log('childIds', childIds.toJS());
    state = state.setIn(['panes', parentId, 'childIds'], childIds);
  }
  console.log('mo', state.toJS());
  return {state, group};
}

function getDirection(splitType) {
  if (splitType === CHILD_ABOVE || splitType === CHILD_BELOW) return COL;
  if (splitType === CHILD_LEFT || splitType === CHILD_RIGHT) return ROW;
}

function getOffset(splitType) {
  if (splitType === CHILD_ABOVE || splitType === CHILD_LEFT) return 0;
  if (splitType === CHILD_BELOW || splitType === CHILD_RIGHT) return 1;
}

function split(state, {id, splitType}) {
  let pane = state.panes.get(id);
  let parent = state.panes.get(pane.parentId);
  let direction = getDirection(splitType);
  let isRoot = id === state.rootId;

  if (!parent || (parent.direction !== direction)) {
    let out = wrapPane(state, id);
    parent = out.group;
    parent = parent.set('direction', direction);
    console.log(id + '', isRoot);
    state = out.state;
    if (isRoot) {
      state = state.set('rootId', parent.id);
    }
    pane = pane.set('splitRatio', 1);
  }
  let childIds = parent.childIds;
  let index = childIds.indexOf(id);
  let newPane = new Pane({
    id: getNextId(state),
    parentId: parent.get('id'),
    splitRatio: 0.2
  });
  let offset = getOffset(splitType);
  console.log('parent', parent.toJS());
  childIds = childIds.splice(index + offset, 0, newPane.id);
  // let shrinkPane = pane;
  // if (offset === 0) {
  // //  shrinkPane = state.panes.get(childIds.get(index - 2));
  // }
  parent = parent.set('childIds', childIds);
  state = state.setIn(['panes', parent.id], parent);
  state = state.setIn(['panes', newPane.id], newPane);
  state = state.setIn(['panes', pane.id, 'splitRatio'], pane.splitRatio * 0.75);
  state = state.setIn(['panes', newPane.id, 'splitRatio'], pane.splitRatio * 0.25);
  console.log(state.toJS());
  return state;
}

function removePane(state, id) {
  //splice pane out of parents childIds
  let pane = state.panes.get(id);
  let parent = state.panes.get(pane.parentId);
  if (!parent) return state;
  let childIds = parent.childIds;
  let index = childIds.indexOf(id);
  let panes = state.panes;
  childIds = childIds.splice(index, 1);
  parent = parent.set('childIds', childIds);
  panes = panes.set(parent.id, parent);
  if (childIds.size === 1) {
    let remainingPane = panes.get(childIds.get(0));
    if (parent.id === state.rootId) {
      state = state.set('rootId', remainingPane.id);
      remainingPane = remainingPane.set('parentId', undefined);
    } else {
      let grandparentId = parent.parentId;
      let grandparent = panes.get(grandparentId);
      let grandchildIds = grandparent.childIds;
      index = grandchildIds.indexOf(parent.id);
      grandchildIds = grandchildIds.set(index, remainingPane.id);
      grandparent = grandparent.set('childIds', grandchildIds);
      remainingPane = remainingPane.set('parentId', grandparentId);
      panes = panes.set(grandparent.id, grandparent);
    }
    panes = panes.delete(parent.id);
    remainingPane = remainingPane.set('direction', undefined);
    panes = panes.set(remainingPane.id, remainingPane);
  }
  panes = panes.delete(id);
  state = state.set('panes', panes);
  return state;
}

function join(state, {retainId, removeId}) {
  let remove = state.panes.get(removeId);
  if (remove.isGroup) {
    console.warn('cannot replace group');
    return state;
  }
  let retain = state.panes.get(retainId);
  let parent = state.panes.get(retain.parentId);
  let siblings = parent.childIds;
  let pos = [retainId, removeId].map(id => siblings.indexOf(id));
  if (
    pos[1] === -1 ||
    pos[0] === -1 ||
    !(pos[0] + 1 === pos[1] || pos[0] - 1 === pos[1])
  ) {
    console.warn('pane must be adjacent to join');
    return state;
  }
  state = removePane(state, removeId);
  let splitRatio = remove.splitRatio + retain.splitRatio;
  state = state.setIn(['panes', retain.id, 'splitRatio'], splitRatio);
  return state;
}

function setSplitRatio(state, action) {
  const {splitRatio, id} = action;

  state = state.setIn(
    ['panes', id, 'splitRatio'],
    splitRatio
  );
  return state;
}

function setSize(state, {width, height}) {
  return state.set('width', width).set('height', height);
}

function setMode(state, action) {
  const {mode, id, splitStartX, splitStartY} = action;
  return state
    .set('mode', mode)
    .set('splitJoinId', id)
    .set('splitStartX', splitStartX)
    .set('splitStartY', splitStartY);
}

export default function LayoutReducer(state = initialState, action) {

  switch (action.type) {
  case SPLIT:
    console.log(action);
    return split(state, action);

  case JOIN:
    return join(state, action);

  case SET_SPLIT_RATIO:
    return setSplitRatio(state, action);

  case SET_SIZE:
    return setSize(state, action);

  case SET_MODE:
    return setMode(state, action);

  default:
    return state;
  }
}
