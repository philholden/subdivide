import produce from "immer";

import {
  SPLIT,
  JOIN,
  SET_SPLIT_RATIO,
  SET_SIZE,
  SET_CORNER_DOWN,
  SET_DIVIDER_DOWN,
  SET_STATE,
  SET_PANE_PROPS,
  SET_CORNER_HOVER,
  SET_DIVIDER_STYLES
} from "./constants";

import {
  split,
  join,
  setSplitRatio,
  setSize,
  setCornerDown,
  setDividerDown,
  deserialize,
  setPaneProps,
  setCornerHover,
  setDividerStyles
} from "./subdivide";

import { secondPass } from "./secondPass";
import { createLayout } from "./createLayout";
//import { setDividerStyles } from "./subdivideActionCreators";

let firstPass = (state, action) => {
  //state = deserialize(state);

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
    case SET_CORNER_HOVER:
      return setCornerHover(state, action);
    case SET_DIVIDER_DOWN:
      return setDividerDown(state, action);
    case SET_STATE:
      return action.state;
    case SET_PANE_PROPS:
      return setPaneProps(state, action);
    case SET_DIVIDER_STYLES:
      return setDividerStyles(state, action);
    default:
      return state;
  }
};

export function reducer(state = createLayout(), action) {
  return produce(state, draft => {
    firstPass(state, action);
    secondPass(state);
  });
}
