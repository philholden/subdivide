import {
  ADD_CHILD_PANE,
  REMOVE_PARENT_PANE,
  REMOVE_CHILD_PANE,
  SET_SPLIT_RATIO
} from '../constants/CampaignTableConstants';

import { Record, List, Map} from 'immutable';

const initialState = Map({

  panes: Map()
});

const Pane = new Record({
  id: 0,
  childId: undefined,
  parentId: 0,
  splitType: undefined,
  splitRatio: 1,
  contents: undefined
});

function getNextId(state) {
  return state.get('panes').map( pane => pane.id ).max() + 1;
}

function addChild(state, action) {
  const {splitType, id} = action;
  const childId = getNextId(state);
  const childPane = new Pane({
    id: childId,
    parentId: id
  });
  state = state.mergeIn(
    ['panes', action.id, 'childId'],
    {childId, splitType}
  );
  state = state.setIn(['panes', childId], childPane);
  return state;
}

function removeChildPane(state, action) {
  const {id} = action;
  const currentPane = state.getIn(['panes', id]);
  const {childId, splitRatio} = currentPane;
  const childPane = state.getIn(['panes', childId]);
  if (childPane === undefined) return state;
  const panes = state.get('panes').delete(childId);
  const hasGrandchild = (childPane.childId === undefined);
  let grandchild;
  splitRatio = hasGrandchild ? splitRatio : 1;

  currentPane = currentPane.merge({
    childId: childPane.childId,
    splitType: undefined,
    splitRatio: splitRatio
  });

  panes = panes.set(id, currentPane);
  state = state.set('panes', panes);

  if (hasGrandchild) {
    grandchild = state.getIn(['panes', childPane.childId]);
    grandchild.set('parentId', id);
  }

  return state;
}

function removeParentPane(state, action) {
  const {id} = action;
  const currentPane = state.getIn(['panes', id]);
  const {parentId, splitRatio} = currentPane;
  const parentPane = state.getIn(['panes', parentId]);
  if (parentPane === undefined) return state;
  const panes = state.get('panes').delete(parentId);
  const hasGrandparent = (parentPane.parentId === undefined);
  let grandparent;
  splitRatio = hasGrandparent ? splitRatio : 1;

  currentPane = currentPane.merge({
    parentId: parentPane.parentId,
    splitType: undefined,
    splitRatio: splitRatio
  });

  panes = panes.set(id, currentPane);
  state = state.set('panes', panes);

  if (hasGrandparent) {
    grandparent = state.getIn(['panes', parentPane.parentId]);
    grandparent.set('parentId', id);
  }

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
