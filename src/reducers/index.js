import LayoutReducer from './LayoutReducer';
import { Record } from 'immutable';

const Reducer = Record({
  layout: LayoutReducer(undefined, {})
});

const initialState = Reducer();

export default function (state = initialState, action) {
  return state
    .set('layout', LayoutReducer(state, action));
}
