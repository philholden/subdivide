import {
  createAction,
  combineActions,
  handleActions
} from 'redux-actions';
import { createTypes } from 'redux-create-types';

import secondPass from '../helpers/secondPass';

export const ns = 'subdivide';

export const cardinals = {
  ne: 'NE',
  sw: 'SW',
  se: 'SE',
  nw: 'NW'
};

export const directions = {
  row: 'ROW',
  col: 'COL'
};

export const splitTypes = createTypes([
  'above',
  'below',
  'left',
  'right',
  'none'
], 'split');


export const joinTypes = createTypes([
  'right',
  'up',
  'left',
  'down'
], 'join');

export const types = createTypes([
  'join',
  'split',

  'ADD_CHILD_PANE',
  'REMOVE_CHILD_PANE',
  'REMOVE_PARENT_PANE',

  'dividerPressed',
  'dividerMoved',
  'dividerReleased',

  'windowResize',
  'SET_BLOCK',
  'SET_PANE_PROPS',

  'cornerPressed',
  'cornerReleased',
  'hoverOverCorner',
  'blurCorner'
], ns);

export const createPane = (values = {}) => ({
  id: 0,
  childIds: [],
  isGroup: false,
  splitRatio: 1,
  props: {},
  ...values
});

export const createLayout = (values = {}) => ({
  rootId: 0,
  borderSize: 1,
  cellSpacing: 3,
  touchMargin: 2,
  width: 800,
  height: 600,
  panesById: {
    0: createPane()
  },
  panes: [ 0 ],
  dividers: {},
  ...values
});

function getSplitDirection(splitType) {
  if (
    splitType === splitTypes.above ||
    splitType === splitTypes.below
  ) {
    return directions.col;
  }
  if (
    splitType === splitTypes.left ||
    splitType === splitTypes.right
  ) {
    return directions.row;
  }
  return null;
}

export const join = createAction(
  types.join,
  (retainId, removeId) => ({ retainId, removeId })
);
export const split = createAction(
  types.split,
  (id, splitType, startX = 0, startY = 0) => ({
    id,
    splitType,
    startX,
    startY
  })
);

export const dividerPressed = createAction(types.dividerPressed);
export const dividerReleased = createAction(types.dividerReleased);
export const dividerMoved = createAction(
  types.dividerMoved,
  (afterPaneId, beforePaneId, afterRatio, beforeRatio) => ({
    afterPaneId,
    afterRatio,
    beforePaneId,
    beforeRatio
  })
);

export const windowResize = createAction(
  types.windowResize,
  (width, height) => ({ width, height })
);

export const setBlock = createAction(types.SET_BLOCK);
export const hoverOverCorner = createAction(types.hoverOverCorner);
export const blurCorner = createAction(types.blurCorner);
export const cornerPressed = createAction(types.cornerPressed);
export const cornerReleased = createAction(types.cornerReleased);

function getOffset(splitType) {
  if (
    splitType === splitTypes.above ||
    splitType === splitTypes.left
  ) {
    return 0;
  }
  if (
    splitType === splitTypes.below ||
    splitType === splitTypes.right
  ) {
    return 1;
  }
  return null;
}

function areNotAdjacent({ childIds }, { id: removeId }, { id: retainId }) {
  const removePos = childIds.indexOf(removeId);
  const retainPos = childIds.indexOf(retainId);
  return (
    removePos === -1 ||
    retainPos === -1 ||
    !(
      removePos + 1 === retainPos ||
      removePos - 1 === retainPos
    )
  );
}

function getNextId(panes = [ 0 ]) {
  const id = panes[ panes.length - 1 ];
  return id + 1;
}

function getRatio(
  startX,
  startY,
  offset,
  direction,
  hasNewParent,
  { width, height, left, top, splitRatio }
) {
  let ratio = direction === directions.row ?
    (startX - left) / width :
    (startY - top) / height;

  let ratioA = ratio = offset ? ratio : 1 - ratio;
  let ratioB = 1 - ratioA;

  if (hasNewParent) {
    ratioA *= splitRatio;
    ratioB *= splitRatio;
  }
  return [ ratioA, ratioB ];
}

export function downDividerSelector(state) {
  const { dividerDown } = state;
  if (!dividerDown) {
    return null;
  }
  return {
    ...state.dividers[dividerDown.id],
    ...dividerDown
  };
}

const firstPass = handleActions({
  // creates a new pane group, puts the existing and the newly created pane
  // as children of that group pane
  // so if we start with a 0 root pane and split it, we create a group
  // pane (id 1) make this the root pane, create a new pane, and finally attach
  // those two panes as children of the new root group pane
  // Split(0) => Group(1) < Children(0, 2)
  [types.split]: (state, { payload: { id, splitType, startX, startY } }) => {
    const panes = [ ...state.panes ];
    const panesById = { ...state.panesById };
    const currentPane = { ...panesById[id] };
    const { parentId: oldParentId, splitRatio } = currentPane;
    let rootId = state.rootId;
    const isRoot = id === rootId;
    const oldParent = { ...panesById[oldParentId] };
    const offset = getOffset(splitType);
    const direction = getSplitDirection(splitType);
    let currentParent = { ...oldParent };

    // if no parent or if parent direction is not the same
    // as the split a new group must be created
    if (oldParent.direction !== direction) {
      // current pane being split
      const newParentId = getNextId(panes);
      panes.push(newParentId);

      if (isRoot) {
        rootId = newParentId;
      }
      // this pane becomes the current pane's parent
      // and a child of the old parent pane
      const newParent = currentParent = createPane({
        id: newParentId,
        isGroup: true,
        childIds: [ id ],
        parentId: oldParentId,
        splitRatio: splitRatio,
        direction
      });
      // set the new panes parent as the group pane above
      currentPane.parentId = newParentId;
      panesById[newParentId] = newParent;

      // update parent's child id's
      // to the new parent pane's id
      // we check for any property on
      // the parent because it can be an empty object
      if (oldParent.id) {
        const oldParentChildren = [ ...oldParent.childIds ];
        oldParentChildren[ oldParentChildren.indexOf(id) ] = newParentId;
        oldParent.childIds = oldParentChildren;
        panesById[oldParentId] = oldParent;
      }
    }

    // at this point current parent should always point to a pane
    const childIds = [ ...currentParent.childIds ];
    const currentPaneIndex = childIds.indexOf(id);

    const [ ratioA, ratioB ] = getRatio(
      startX,
      startY,
      direction,
      offset,
      currentParent.id === oldParentId,
      currentPane
    );
    currentPane.splitRatio = ratioA;
    const newPane = createPane({
      id: getNextId(panes),
      parentId: currentParent.id,
      splitRatio: ratioB
    });
    panes.push(newPane.id);

    //  insert new pane into children of current parent pane
    childIds.splice(currentPaneIndex + offset, 0, newPane.id);
    currentParent.childIds = childIds;

    const beforePaneId = offset ? currentPane.id : newPane.id;
    const afterPaneId = offset ? newPane.id : currentPane.id;
    const newDividerId = beforePaneId + 'n' + afterPaneId;
    panesById[currentParent.id] = currentParent;
    panesById[newPane.id] = newPane;
    panesById[currentPane.id] = currentPane;
    const dividerDown = {
      id: newDividerId,
      startX,
      startY
    };
    return {
      ...state,
      panes,
      rootId,
      panesById,
      dividerDown,
      cornerDown: undefined
    };
  },

  // check if pane is a group
  // check to make sure panes are next to each other
  // remove from parent
  // if parent only has one child
  //  - if parent is root, remove and make remaining child root
  //  - otherwise remove parent and attach child to grandparent
  [types.join]: (state, { payload: { retainId, removeId } }) => {
    const panesById = { ...state.panesById };
    const remove = panesById[removeId];
    const retain = { ...panesById[retainId] };
    const parent = panesById[retain.parentId];
    let rootId = state.rootId;
    if (remove.id === rootId) {
      // attempted to remove root pane
      return state;
    }
    if (remove.isGroup) {
      // cannot remove a parent
      return state;
    }
    if (areNotAdjacent(parent, remove, retain)) {
      // pane must be adjacent to join
      return state;
    }
    // splice pane out of parents childIds

    // grab siblings
    const childIds = [ ...parent.childIds ];
    // where does remove pane exist
    const index = childIds.indexOf(removeId);
    // create child array with just removed pane
    childIds.splice(index, 1);
    // update panesById with new parent
    panesById[parent.id] = {
      ...parent,
      childIds
    };

    // if parent now only has one child (the retain pane)
    // it is no longer a group and can be removed
    // and this retaining child moved up to it's grandparent
    if (childIds.length === 1) {
      const newRetain = {
        ...retain,
        direction: null
      };
      // group is the root pane. It can be removed and the remaining made
      // the new root
      if (parent.id === rootId) {
        rootId = retainId;
        newRetain.parentId = null;
      } else {
        // group is a child of a group
        // we can remove it and move the remaining to that super group
        const grandparentId = parent.parentId;
        const grandparent = { ...panesById[grandparentId] };
        const grandchildIds = [ ...grandparent.childIds ];
        const parentIndex = grandchildIds.indexOf(parent.id);

        grandchildIds[parentIndex] = newRetain.id;
        grandparent.childIds = grandchildIds;

        newRetain.parentId = grandparentId;
        panesById[grandparentId] = grandparent;
      }
      delete panesById[parent.id];
      panesById[newRetain.id] = newRetain;
    }
    delete panesById[removeId];

    const parentId = panesById[retainId].parentId;
    const splitRatio = parent.id === parentId ?
      remove.splitRatio + retain.splitRatio :
      parent.splitRatio;

    panesById[retainId].splitRatio = splitRatio;
    return {
      ...state,
      // possible new if parent was root and had one remaining child
      rootId,
      panesById
    };
  },

  [combineActions(types.dividerPressed, types.dividerReleased)]:
    (state, { payload }) => {
      return {
        ...state,
        dividerDown: payload
      };
    },

  [types.dividerMoved]: (state, { payload }) => {
    const { afterPaneId, afterRatio, beforePaneId, beforeRatio } = payload;
    const { panesById } = state;
    return {
      ...state,
      panesById: {
        ...panesById,
        [afterPaneId]: {
          ...panesById[afterPaneId],
          splitRatio: afterRatio
        },
        [beforePaneId]: {
          ...panesById[beforePaneId],
          splitRatio: beforeRatio
        }
      }
    };
  },

  [types.windowResize]: (state, { payload: { width, height } }) => {
    return {
      ...state,
      width,
      height
    };
  },

  [combineActions(types.cornerPressed, types.cornerReleased)]:
    (state, { payload }) => {
      return {
        ...state,
        cornerDown: payload
      };
    },

  [combineActions(types.hoverOverCorner, types.blurCorner)]:
    (state, { payload }) => {
      return {
        ...state,
        cornerHover: payload
      };
    }

}, createLayout());

export default function reducer(state, action) {
  const newState = firstPass(state, action);
  if (newState === state) {
    return state;
  }
  return secondPass(newState);
}

reducer.toString = () => ns;
