import LayoutReducer from './LayoutReducer';
import {Record} from 'immutable';

const Container = Record({
  layout: LayoutReducer(undefined, {type: 'unknown'})
});

const initialState = Container();

export default function (state = initialState, action) {
  if (!(state instanceof Container)) {
    state = Container({layout: state.layout});
  }
  return state
    .set('layout', LayoutReducer(state.layout, action));
}
