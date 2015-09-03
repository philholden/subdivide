import {
  SPLIT,
  JOIN,
  SET_SPLIT_RATIO
} from '../constants/BlenderLayoutConstants';

import { Record, List, Map} from 'immutable';

import {
  split,
  join,
  setSplitRatio
} from '../helpers/PaneHelper';

export const Pane = new Record({
  id: '0',
  childIds: List(),
  isGroup: false,
  direction: undefined,
  parentId: undefined,
  splitRatio: 1
});

const initialState = Map({
  '0': Pane()
});



export default function LayoutReducer(state = initialState, action) {

  switch (action.type) {
  case SPLIT:
    return split(state, action);

  case JOIN:
    return join(state, action);

  case SET_SPLIT_RATIO:
    return setSplitRatio(state, action);

  default:
    return state;
  }
}
