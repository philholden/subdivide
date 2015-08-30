import {
  ADD_CHILD_PANE,
  REMOVE_CHILD_PANE,
  REMOVE_PARENT_PANE,
  SET_SPLIT_RATIO
} from '../constants/RealTimeMeshConstants';


export function setSplitRatio(id, splitRatio) {
  return {
    type: SET_SPLIT_RATIO,
    splitRatio,
    id
  };
}

export function split(id, splitType){
  return {
    type: split,
    id,
    splitType
  };
}

export function merge(expandedId, removedId){
  return {
    type: REMOVE_CHILD_PANE,
    expandedId,
    removedId
  };
}
