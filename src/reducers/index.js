import { Record, List, Map, OrderedSet } from 'immutable'

import {
  SPLIT,
  JOIN,
  SET_SPLIT_RATIO,
  SET_SIZE,
  SET_CORNER_DOWN,
  SET_DIVIDER_DOWN,
  SET_STATE,
  SET_PANE_PROPS,
  SET_CORNER_HOVER
} from '../constants'

import {
  split,
  join,
  setSplitRatio,
  setSize,
  setCornerDown,
  setDividerDown,
  deserialize,
  setPaneProps,
  setCornerHover
} from '../helpers/LayoutHelper'

import secondPass from '../helpers/secondPass'

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
  joinDirection: undefined,
  props: {}
})

export const Layout = new Record({
  rootId: '0',
//  dividerSize: 3,
  borderSize: 1,
  cellSpacing: 3,
  touchMargin: 2,
  mode: undefined,
  dividerDown: undefined,
  cornerDown: undefined,
  cornerHover: undefined,
  width: 800,
  height: 600,
  panes: Map({
    '0': new Pane()
  }),
  allPanesIdsEver: OrderedSet.of('0'),
  dividers: Map()
})

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
})

let firstPass = (state, action) => {
  state = deserialize(state)

  switch (action.type) {
    case SPLIT:
      return split(state, action)

    case JOIN:
      return join(state, action)

    case SET_SPLIT_RATIO:
      return setSplitRatio(state, action)

    case SET_SIZE:
      return setSize(state, action)

    case SET_CORNER_DOWN:
      return setCornerDown(state, action)

    case SET_CORNER_HOVER:
      return setCornerHover(state, action)

    case SET_DIVIDER_DOWN:
      return setDividerDown(state, action)
    case SET_STATE:
      return deserialize(action.state)
    case SET_PANE_PROPS:
      return setPaneProps(state, action)

    default:
      return state
  }
}

export default function subdivide(state = Layout(), action) {
  state = firstPass(state, action)
  state = secondPass(state)
  return state
}
