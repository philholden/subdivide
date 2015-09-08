import {
  SET_SPLIT_RATIO,
  SPLIT,
  JOIN,
  SET_SIZE,
  SET_BLOCK,
  SET_CORNER_DOWN,
  SET_DIVIDER_DOWN
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

export function setBlock(displayBlock){
  return {
    type: SET_BLOCK,
    displayBlock
  };
}

export function setCornerDown(cornerDown) {
  return {
    type: SET_CORNER_DOWN,
    cornerDown
  };
}

export function setDividerDown(divider) {
  return {
    type: SET_DIVIDER_DOWN,
    divider
  };
}
