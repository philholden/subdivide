import LayoutReducer from './LayoutReducer';
import {Pane, Layout} from './LayoutReducer';
import {Record, List} from 'immutable';

const startState = (new Layout())
  .set('rootId', '1')
  .setIn(['panes', '0'], new Pane({
    id: '0',
    childIds: List(),
    isGroup: false,
    direction: undefined,
    parentId: '1',
    splitRatio: 0.25
  }))
  .setIn(['panes', '1'], new Pane({
    id: '1',
    childIds: List(['0', '2']),
    isGroup: true,
    direction: 'ROW',
    parentId: undefined,
    splitRatio: 1
  }))
  .setIn(['panes', '2'], new Pane({
    id: '2',
    childIds: List(['3', '4']),
    isGroup: true,
    direction: 'COL',
    parentId: '1',
    splitRatio: 0.75
  }))
  .setIn(['panes', '3'], new Pane({
    id: '3',
    childIds: List(),
    isGroup: false,
    direction: undefined,
    parentId: '2',
    splitRatio: 1 / 3
  }))
  .setIn(['panes', '4'], new Pane({
    id: '4',
    childIds: List(),
    isGroup: false,
    direction: undefined,
    parentId: '2',
    splitRatio: 2 / 3
  }));

const Reducer = Record({
  layout: LayoutReducer(undefined, {})
});

const initialState = Reducer();

export default function (state = initialState, action) {
  return state
    .set('layout', LayoutReducer(state.layout, action));
}
