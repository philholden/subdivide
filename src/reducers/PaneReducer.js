import {
  ADD_CHILD_PANE,
  REMOVE_PARENT_PANE,
  REMOVE_CHILD_PANE,
  SET_SPLIT_RATIO,
  CHILD_ABOVE,
  CHILD_BELOW,
  CHILD_LEFT,
  CHILD_RIGHT,
  ROW,
  COL
} from '../constants/CampaignTableConstants';

import { Record, List, Map} from 'immutable';

const initialState = Map({

  panes: Map()
});

const Pane = new Record({
  id: 0,
  childIds: List(),
  isGroup: false,
  direction: undefined,
  parentId: 0,
  splitRatio: 1
});

function getNextId(state) {
  return (
    state
      .get('panes')
      .map(pane => parseInt(pane.id))
      .max() + 1
  ) + '';
}

function wrapPane(state, id) {
  const pane = state.panes.get(id);
  const groupId = getNextId(state)
  const group = new Pane({
    id: groupId,
    isGroup: true,
    childIds: List([id]),
    parentId: pane.parentId
  });
  pane = pane.set('parentId', groupId);
  state = state.setIn(['panes', id], pane);
  state = state.setIn(['panes', groupId], group);
  return {state, group};
}

function getDirection(splitType) {
  if (CHILD_ABOVE || CHILD_BELOW) return COL;
  if (CHILD_LEFT || CHILD_RIGHT) return ROW;
}

function getOffset(splitType) {
  if (CHILD_ABOVE || CHILD_LEFT) return 0;
  if (CHILD_BELOW || CHILD_RIGHT) return 1;
}

function splitPane(state, {id, splitType}) {
  let pane = state.panes.get(id);
  let parent = state.panes.get(pane.parentId);
  let direction = getDirection(splitType);
  if (!parent || parent.direction !== direction) {
    let out = wrapPane(state, id);
    parent = out.group;
    parent = parent.set('direction', direction);
    state = out.state;
  }
  let childIds = parent.childIds;
  let index = childIds.indexOf(id);
  let newPane = new Pane({
    id: getNextId(state),
    parentId: parent.get('id')
  });
  let offset = getOffset(splitType);
  childIds = childIds.splice(index + offset, 0, newPane.id);
  parent = parent.set('childIds', childIds);
  state = state.setIn(['panes', parent.id], parent);
  state = state.setIn(['panes', newPane.id], newPane);
}

function removePane(state, id) {
  //splice out of parents childIds
  let pane = state.panes.get(id);
  let parent = state.panes.get(pane.parentId);
  if (!parent) return state;
  let childIds = parent.childIds;
  let index = childIds.indexOf(id);
  let panes = state.panes;
  childIds = childIds.splice(index, 1);
  parent = parent.set('childIds', childIds);
  if (childIds.length !== 1) {
    state = state.setIn(['panes', parent.id], parent);
  } else {
    //if only one child remains remove group wrapper
    let remainingPane = panes.get(childIds.get(0));
    let grandparentId = parent.parentId;
    let grandparent = panes.get(grandparentId);
    childIds = grandparent.childIds;
    index = childIds.indexOf(parent.id);
    childIds = childIds.set(index, remainingPane.id);
    grandparent = grandparent.set('childIds', childIds);
    remainingPane = remainingPane.set('parentId', grandparentId);
    panes = panes
      .delete(parent.id)
      .set(grandparent.id, grandparent)
      .set(remainingPane.id, remainingPane);
  }
  state = state.set('panes', panes);
  return state;
}

function setSplitRatio(state, action) {
  const {id, splitRatio} = action;
  return state.setIn(
    ['panes', id, 'splitRatio'],
    splitRatio
  );
}

export default function (state = initialState, action) {

  switch (action.type) {
  case ADD_CHILD_PANE:
    return addChild(state, action);

  case REMOVE_CHILD_PANE:
    return removeChildPane(state, action);

  case REMOVE_PARENT_PANE:
    return removeParentPane(state, action);

  case SET_SPLIT_RATIO:
    return setSplitRatio(state, action);

  default:
    return state;
  }
}
