import {
  CHILD_ABOVE,
  CHILD_BELOW,
  CHILD_LEFT,
  CHILD_RIGHT,
  ROW,
  COL
} from '../constants'

import { List, Map } from 'immutable'
import { Pane, Layout, Divider } from '../reducers'
import secondPass from './secondPass'

function getNextId(state) {
  const panes = state.get('panes')

  let id = 0
  while (panes.get(id + '') !== undefined) {
    id += 1
  }

  return id + ''
}

export function deserialize(subdivide) {
  if (subdivide instanceof Layout) return subdivide
  let panes = Map()
  let dividers = Map()
  Object.keys(subdivide.dividers).forEach( key => {
    let divider = subdivide.dividers[key]
    dividers = dividers.set(key, Divider(divider))
  })
  Object.keys(subdivide.panes).forEach( key => {
    let pane = subdivide.panes[key]
    panes = panes.set(key, Pane({
      ...pane,
      childIds: List(pane.childIds)
    }))
  })
  return new Layout({
    ...subdivide,
    panes,
    dividers
  })
}

function wrapPane(state, id) {
  let pane = state.panes.get(id)
  let parent = state.panes.get(pane.parentId)
  let parentId = pane.parentId
  let groupId = getNextId(state)
  let group = new Pane({
    id: groupId,
    isGroup: true,
    childIds: List([ id ]),
    parentId: pane.parentId,
    splitRatio: pane.splitRatio
  })
  state = state.set('allPanesIdsEver', state.allPanesIdsEver.add(groupId))
  pane = pane.set('parentId', groupId)
  state = state.setIn([ 'panes', id ], pane)
  state = state.setIn([ 'panes', groupId ], group)
  if (parent) {
    let childIds = parent.childIds
    childIds = childIds.set(childIds.indexOf(id), groupId)
    state = state.setIn([ 'panes', parentId, 'childIds' ], childIds)
  }
  return { state, group }
}

function getDirection(splitType) {
  if (splitType === CHILD_ABOVE || splitType === CHILD_BELOW) return COL
  if (splitType === CHILD_LEFT || splitType === CHILD_RIGHT) return ROW
}

function getOffset(splitType) {
  if (splitType === CHILD_ABOVE || splitType === CHILD_LEFT) return 0
  if (splitType === CHILD_BELOW || splitType === CHILD_RIGHT) return 1
}

export function split(state, { id, splitType, startX, startY }) {
  let pane = state.panes.get(id)
  let parent = state.panes.get(pane.parentId)
  let direction = getDirection(splitType)
  let isRoot = id === state.rootId
  let oldPane = pane
  let oldParentId = pane.parentId

  if (!parent || (parent.direction !== direction)) {
    let out = wrapPane(state, id)
    parent = out.group
    parent = parent.set('direction', direction)
    state = out.state
    if (isRoot) {
      state = state.set('rootId', parent.id)
    }
    pane = pane.set('splitRatio', 1)
  }
  let childIds = parent.childIds
  let index = childIds.indexOf(id)
  let newPane = new Pane({
    id: getNextId(state),
    parentId: parent.get('id'),
    splitRatio: 0.2
  })
  let offset = getOffset(splitType)
  childIds = childIds.splice(index + offset, 0, newPane.id)
  let beforePaneId = offset ? pane.id : newPane.id
  let afterPaneId = offset ? newPane.id : pane.id
  let ratio = direction === ROW ?
    (startX - oldPane.left) / oldPane.width :
    (startY - oldPane.top) / oldPane.height
  let ratioA = ratio = offset ? ratio : 1 - ratio
  let ratioB = 1 - ratioA
  if (newPane.parentId === oldParentId) {
    ratioA *= oldPane.splitRatio
    ratioB *= oldPane.splitRatio
  }
  parent = parent.set('childIds', childIds)
  state = state.set('allPanesIdsEver', state.allPanesIdsEver.add(newPane.id))
  state = state.setIn([ 'panes', parent.id ], parent)
  state = state.setIn([ 'panes', newPane.id ], newPane)
  state = state.setIn([ 'panes', pane.id, 'splitRatio' ], ratioA)
  state = state.setIn([ 'panes', newPane.id, 'splitRatio' ], ratioB)
  state = state.set('cornerDown', undefined)
  let newDividerId = beforePaneId + 'n' + afterPaneId
  state = secondPass(state)
  let divider = { ...state.dividers.get(newDividerId).toJS(), startX, startY }
  state = state.set('dividerDown', divider)
  return state
}

function removePane(state, id) {
  //splice pane out of parents childIds
  let pane = state.panes.get(id)
  let parent = state.panes.get(pane.parentId)
  if (!parent) return state
  let childIds = parent.childIds
  let index = childIds.indexOf(id)
  let panes = state.panes
  childIds = childIds.splice(index, 1)
  parent = parent.set('childIds', childIds)
  panes = panes.set(parent.id, parent)
  if (childIds.size === 1) {
    let remainingPane = panes.get(childIds.get(0))
    if (parent.id === state.rootId) {
      state = state.set('rootId', remainingPane.id)
      remainingPane = remainingPane.set('parentId', undefined)
    } else {
      let grandparentId = parent.parentId
      let grandparent = panes.get(grandparentId)
      let grandchildIds = grandparent.childIds
      index = grandchildIds.indexOf(parent.id)
      grandchildIds = grandchildIds.set(index, remainingPane.id)
      grandparent = grandparent.set('childIds', grandchildIds)
      remainingPane = remainingPane.set('parentId', grandparentId)
      panes = panes.set(grandparent.id, grandparent)
    }
    panes = panes.delete(parent.id)
    remainingPane = remainingPane.set('direction', undefined)
    panes = panes.set(remainingPane.id, remainingPane)
  }
  panes = panes.delete(id)
  state = state.set('panes', panes)
  return state
}

export function join(state, { retainId, removeId }) {
  let remove = state.panes.get(removeId)
  if (remove.isGroup) {
    console.warn('cannot replace group')
    return state
  }
  let retain = state.panes.get(retainId)
  let parent = state.panes.get(retain.parentId)
  let siblings = parent.childIds
  let pos = [ retainId, removeId ].map(id => siblings.indexOf(id))
  if (
    pos[1] === -1 ||
    pos[0] === -1 ||
    !(pos[0] + 1 === pos[1] || pos[0] - 1 === pos[1])
  ) {
    console.warn('pane must be adjacent to join')
    return state
  }
  state = removePane(state, removeId)
  let nextParentId = state.getIn([ 'panes', retainId ]).parentId
  let splitRatio = parent.id === nextParentId ?
    remove.splitRatio + retain.splitRatio :
    parent.splitRatio
  state = state.setIn([ 'panes', retain.id, 'splitRatio' ], splitRatio)
  return state
}

export function setSplitRatio(state, action) {
  const { splitRatio, id } = action

  state = state.setIn(
    [ 'panes', id, 'splitRatio' ],
    splitRatio
  )
  return state
}

export function setSize(state, { width, height }) {
  return state.set('width', width).set('height', height)
}

export function setCornerDown(state, action) {
  return state
    .set('cornerDown', action.cornerDown)
}

export function setCornerHover(state, action) {
  return state
    .set('cornerHover', action.cornerHover)
}

export function setDividerDown(state, action) {
  return state
    .set('dividerDown', action.divider)
}

export function setPaneProps(state, { id, props }) {
  return state.setIn([ 'panes', id, 'props' ], props)
}
