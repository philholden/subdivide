import expect from 'expect'
import layout from '../'
import { Pane, Layout } from '../'
import {
  CHILD_ABOVE,
  CHILD_BELOW,
  CHILD_LEFT,
  CHILD_RIGHT,
  ROW,
  COL,
  SPLIT,
  JOIN
} from '../../constants'

import { List, Map } from 'immutable'

describe('pane reducer', () => {
  let startState, endState, action


  beforeEach(() => {
    startState = Map({
      panes: Map()
    })
  })

  describe('split right', () => {
    let original, parent, added
    beforeEach(() => {
      startState = new Layout()

      action = {
        type: SPLIT,
        id: '0',
        splitType: CHILD_RIGHT
      }

      endState = layout(startState, action)
      original = endState.panes.get('0')
      parent = endState.panes.get(original.parentId)
      //console.log(original, parent)
      added = endState.panes.get(parent.childIds.last())
    })

    it('parent should be added', () => {
      expect(parent).toExist()
    })

    it('new child should be added', () => {
      expect(added).toExist()
    })

    it('parent should have two children in correct order', () => {
      expect(parent.childIds.toJS()).toEqual([ original.id, added.id ])
    })

    it('parents direction should be row', () => {
      expect(parent.direction).toEqual(ROW)
    })

    it('original and added should have parent as parent', () => {
      expect(original.parentId).toEqual(parent.id)
      expect(added.parentId).toEqual(parent.id)
    })
  })

  describe('split left', () => {
    let original, parent, added
    beforeEach(() => {
      startState = new Layout()

      action = {
        type: SPLIT,
        id: '0',
        splitType: CHILD_LEFT
      }

      endState = layout(startState, action)
      original = endState.panes.get('0')
      parent = endState.panes.get(original.parentId)
      added = endState.panes.get(parent.childIds.first())
    })

    it('parent should have two children in correct order', () => {
      expect(parent.childIds.toJS()).toEqual([ added.id, original.id ])
    })

    it('parents direction should be row', () => {
      expect(parent.direction).toEqual(ROW)
    })
  })

  describe('split above', () => {
    let original, parent, added
    beforeEach(() => {
      startState = new Layout()

      action = {
        type: SPLIT,
        id: '0',
        splitType: CHILD_ABOVE
      }

      endState = layout(startState, action)
      original = endState.panes.get('0')
      parent = endState.panes.get(original.parentId)
      added = endState.panes.get(parent.childIds.first())
    })

    it('parent should have two children in correct order', () => {
      expect(parent.childIds.toJS()).toEqual([ added.id, original.id ])
    })

    it('parents direction should be col', () => {
      expect(parent.direction).toEqual(COL)
    })
  })

  describe('split below', () => {
    let original, parent, added
    beforeEach(() => {
      startState = new Layout()

      action = {
        type: SPLIT,
        id: '0',
        splitType: CHILD_BELOW
      }

      endState = layout(startState, action)
      original = endState.panes.get('0')
      parent = endState.panes.get(original.parentId)
      added = endState.panes.get(parent.childIds.last())
    })

    it('parent should have two children in correct order', () => {
      expect(parent.childIds.toJS()).toEqual([ original.id, added.id ])
    })

    it('parents direction should be col', () => {
      expect(parent.direction).toEqual(COL)
    })
  })

  describe('join one of two in row below root', () => {
    beforeEach(() => {
      startState = (new Layout())
        .set('rootId', '1')
        .setIn([ 'panes', '0' ], new Pane({
          id: '0',
          childIds: List(),
          isGroup: false,
          direction: undefined,
          parentId: '1',
          splitRatio: 0.25
        }))
        .setIn([ 'panes', '1' ], new Pane({
          id: '1',
          childIds: List([ '0', '2' ]),
          isGroup: true,
          direction: 'ROW',
          parentId: undefined,
          splitRatio: 1
        }))
        .setIn([ 'panes', '2' ], new Pane({
          id: '2',
          childIds: List(),
          isGroup: false,
          direction: undefined,
          parentId: '1',
          splitRatio: 0.75
        }))

      action = {
        type: JOIN,
        removeId: '0',
        retainId: '2'
      }

      endState = layout(startState, action)
    })

    it('remaining pane should be root', () => {
      expect(endState.rootId).toEqual('2')
    })

    it('parent pane should be deleted', () => {
      expect(endState.panes.get('1')).toBe(undefined)
    })

    it('removed pane should be deleted', () => {
      expect(endState.panes.get('0')).toBe(undefined)
    })

    it('remaining pane should exist', () => {
      expect(endState.panes.get('2')).toExist()
    })

    it('remaining pane should not have direction', () => {
      expect(endState.panes.get('2').direction).toBe(undefined)
    })

    it('remaining pane should not have parent', () => {
      expect(endState.panes.get('2').parent).toBe(undefined)
    })

  })


  describe('join one of three in row below root', () => {
    beforeEach(() => {
      startState = (new Layout())
        .set('rootId', '1')
        .setIn([ 'panes', '0' ], new Pane({
          id: '0',
          childIds: List(),
          isGroup: false,
          direction: undefined,
          parentId: '1',
          splitRatio: 0.33
        }))
        .setIn([ 'panes', '1' ], new Pane({
          id: '1',
          childIds: List([ '0', '2', '3' ]),
          isGroup: true,
          direction: 'ROW',
          parentId: undefined,
          splitRatio: 1
        }))
        .setIn([ 'panes', '2' ], new Pane({
          id: '2',
          childIds: List(),
          isGroup: false,
          direction: undefined,
          parentId: '1',
          splitRatio: 0.33
        }))
        .setIn([ 'panes', '3' ], new Pane({
          id: '3',
          childIds: List(),
          isGroup: false,
          direction: undefined,
          parentId: '1',
          splitRatio: 0.33
        }))

      action = {
        type: JOIN,
        removeId: '0',
        retainId: '2'
      }

      endState = layout(startState, action)
      //console.log(endState.toJS())
    })

    it('root should be unchanged', () => {
      expect(endState.rootId).toEqual('1')
    })

    it('parent pane should not be deleted', () => {
      expect(endState.panes.get('1')).toExist()
    })

    it('parent pane should have 2 children', () => {
      expect(endState.panes.get('1').childIds.toJS()).toEqual([ '2', '3' ])
    })

    it('removed pane should be deleted', () => {
      expect(endState.panes.get('0')).toBe(undefined)
    })

    it('remaining pane should exist', () => {
      expect(endState.panes.get('2')).toExist()
    })

    it('remaining pane should have parent', () => {
      expect(endState.panes.get('2').parentId).toBe('1')
    })

  })

  describe('join one of two in row below root', () => {
    beforeEach(() => {
      startState = (new Layout())
        .set('rootId', '1')
        .setIn([ 'panes', '0' ], new Pane({
          id: '0',
          childIds: List(),
          isGroup: false,
          direction: undefined,
          parentId: '1',
          splitRatio: 0.25
        }))
        .setIn([ 'panes', '1' ], new Pane({
          id: '1',
          childIds: List([ '0', '2' ]),
          isGroup: true,
          direction: 'ROW',
          parentId: undefined,
          splitRatio: 1
        }))
        .setIn([ 'panes', '2' ], new Pane({
          id: '2',
          childIds: List([ '3', '4' ]),
          isGroup: true,
          direction: undefined,
          parentId: '1',
          splitRatio: 0.75
        }))
        .setIn([ 'panes', '3' ], new Pane({
          id: '3',
          childIds: List(),
          isGroup: false,
          direction: undefined,
          parentId: '2',
          splitRatio: 0.75
        }))
        .setIn([ 'panes', '4' ], new Pane({
          id: '4',
          childIds: List(),
          isGroup: false,
          direction: undefined,
          parentId: '2',
          splitRatio: 0.75
        }))

      action = {
        type: JOIN,
        removeId: '4',
        retainId: '3'
      }

      endState = layout(startState, action)
      //console.log(endState.toJS())
    })

    it('parent should be deleted', () => {
      expect(endState.panes.get('2')).toBe(undefined)
    })

    it('remaining should be added to grandparents children', () => {
      expect(endState.panes.get('1').childIds.toJS()).toEqual([ '0', '3' ])
    })

    it('remaining parent should be previous grandparent', () => {
      expect(endState.panes.get('3').parentId).toEqual('1')
    })

    it('removed pane should be deleted', () => {
      expect(endState.panes.get('4')).toBe(undefined)
    })

    it('remaining pane should exist', () => {
      expect(endState.panes.get('3')).toExist()
    })

    it('remaining pane should not have direction', () => {
      expect(endState.panes.get('3').direction).toBe(undefined)
    })

  })


})
