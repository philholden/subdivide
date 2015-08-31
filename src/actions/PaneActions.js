import {
  SET_SPLIT_RATIO,
  SPLIT,
  JOIN
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
    type: SPLIT,
    id,
    splitType
  };
}

export function join(retainId, removeId){
  return {
    type: JOIN,
    retainId,
    removeId
  };
}
