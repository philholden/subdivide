import {
  SPLIT,
  JOIN,
  SET_SPLIT_RATIO,
  SET_SIZE,
  SET_CORNER_DOWN,
  SET_DIVIDER_DOWN
} from '../constants/BlenderLayoutConstants';

import { Record, List, Map} from 'immutable';

import {
  split,
  join,
  setSplitRatio,
  setSize,
  setCornerDown,
  setDividerDown,
} from '../helpers/LayoutHelper';

import secondPass from '../helpers/secondPass';

export const Pane = new Record({
  id: '0',
  childIds: List(),
  isGroup: false,
  direction: undefined,
  parentId: undefined,
  splitRatio: 1,

  top: undefined,
  left: undefined,
  width: undefined,
  height: undefined,

  canSplit: undefined,
  joinDirection: undefined
});

export const Layout = new Record({
  rootId: '0',
//  dividerSize: 3,
  borderSize: 1,
  cellSpacing: 3,
  touchMargin: 2,
  mode: undefined,
  dividerDown: undefined,
  cornerDown: undefined,
  width: 800,
  height: 600,
  panes: Map({
    '0': new Pane()
  }),
  dividers: Map()
});

export const Divider = new Record({
  id: undefined,
  top: undefined,
  left: undefined,
  width: undefined,
  height: undefined,
  borderSize: undefined,
  touchMargin: undefined,
  beforePaneId: undefined,
  afterPaneId: undefined,
  beforeRatio: undefined,
  afterRatio: undefined,
  direction: undefined,
  parentSize: undefined
});

const initialState = new Layout();





let firstPass = (state, action) => {

  switch (action.type) {
  case SPLIT:
    return split(state, action);

  case JOIN:
    return join(state, action);

  case SET_SPLIT_RATIO:
    return setSplitRatio(state, action);

  case SET_SIZE:
    return setSize(state, action);

  case SET_CORNER_DOWN:
    return setCornerDown(state, action);

  case SET_DIVIDER_DOWN:
    return setDividerDown(state, action);

  default:
    return state;
  }
};

export default function LayoutReducer(state = initialState, action) {
  state = firstPass(state, action);
  state = secondPass(state);
  return state;
}
