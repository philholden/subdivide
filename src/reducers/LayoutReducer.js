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
  setDividerDown
} from '../helpers/LayoutHelper';

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
  })
});

const initialState = new Layout();



export default function LayoutReducer(state = initialState, action) {

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
    console.log(action);
    return setDividerDown(state, action);

  default:
    return state;
  }
}
