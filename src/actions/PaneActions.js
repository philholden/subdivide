import {
  ADD_CHILD_PANE,
  REMOVE_CHILD_PANE,
  REMOVE_PARENT_PANE,
  SET_SPLIT_RATIO
} from '../constants/RealTimeMeshConstants';


export function setSplitRatio(id, splitRatio) {
  return {
    type: SET_SPLIT_RATIO,
    splitRatio: splitRatio
  };
}

export function addChild(id, splitType){
  return {
    type: ADD_CHILD_PANE,
    id,
    splitType
  };
}

export function removeChildPane(id){
  return {
    type: REMOVE_CHILD_PANE,
    id
  };
}

export function removeParentPane(id){
  return {
    type: REMOVE_PARENT_PANE,
    id
  };
}
