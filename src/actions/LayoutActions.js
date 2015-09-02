import {
  SET_SPLIT_RATIO,
  SPLIT,
  JOIN,
  SET_SIZE,
  SET_MODE
} from '../constants/BlenderLayoutConstants';

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

export function setSize(width, height){
  return {
    type: SET_SIZE,
    width,
    height
  };
}

export function setMode(id, mode, splitStartX, splitStartY){
  return {
    type: SET_MODE,
    mode,
    id,
    splitStartX,
    splitStartY
  };
}
