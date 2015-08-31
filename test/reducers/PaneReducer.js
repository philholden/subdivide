import expect from 'expect';
import PaneReducer from '../../src/reducers/PaneReducer';
import {Pane, Layout} from '../../src/reducers/PaneReducer';
import {
  SET_SPLIT_RATIO,
  CHILD_ABOVE,
  CHILD_BELOW,
  CHILD_LEFT,
  CHILD_RIGHT,
  ROW,
  COL,
  SPLIT,
  JOIN
} from '../../src/constants/BlenderLayoutConstants';

import { Record, List, Map} from 'immutable';

describe('pane reducer', () => {
  let startState, endState, action, testee;


  beforeEach(() => {
    startState = Map({
      panes: Map()
    });
  });

  describe('split right', () => {
    let original, parent, added;
    beforeEach(() => {
      startState = new Layout();

      action = {
        type: SPLIT,
        id: '0',
        splitType: CHILD_RIGHT
      };

      endState = PaneReducer(startState, action);
      original = endState.panes.get('0');
      parent = endState.panes.get(original.parentId);
      //console.log(original, parent);
      added = endState.panes.get(parent.childIds.last());
    });

    it('parent should be added', () => {
      expect(parent).toExist();
    });

    it('new child should be added', () => {
      expect(added).toExist();
    });

    it('parent should have two children in correct order', () => {
      expect(parent.childIds.toJS()).toEqual([original.id, added.id]);
    });

    it('parents direction should be row', () => {
      expect(parent.direction).toEqual(ROW);
    });

    it('original and added should have parent as parent', () => {
      expect(original.parentId).toEqual(parent.id);
      expect(added.parentId).toEqual(parent.id);
    });
  });

  describe('split left', () => {
    let original, parent, added;
    beforeEach(() => {
      startState = new Layout();

      action = {
        type: SPLIT,
        id: '0',
        splitType: CHILD_LEFT
      };

      endState = PaneReducer(startState, action);
      original = endState.panes.get('0');
      parent = endState.panes.get(original.parentId);
      added = endState.panes.get(parent.childIds.first());
    });

    it('parent should have two children in correct order', () => {
      expect(parent.childIds.toJS()).toEqual([added.id, original.id]);
    });

    it('parents direction should be row', () => {
      expect(parent.direction).toEqual(ROW);
    });
  });

  describe('split above', () => {
    let original, parent, added;
    beforeEach(() => {
      startState = new Layout();

      action = {
        type: SPLIT,
        id: '0',
        splitType: CHILD_ABOVE
      };

      endState = PaneReducer(startState, action);
      original = endState.panes.get('0');
      parent = endState.panes.get(original.parentId);
      added = endState.panes.get(parent.childIds.first());
    });

    it('parent should have two children in correct order', () => {
      expect(parent.childIds.toJS()).toEqual([added.id, original.id]);
    });

    it('parents direction should be col', () => {
      expect(parent.direction).toEqual(COL);
    });
  });

  describe('split below', () => {
    let original, parent, added;
    beforeEach(() => {
      startState = new Layout();

      action = {
        type: SPLIT,
        id: '0',
        splitType: CHILD_BELOW
      };

      endState = PaneReducer(startState, action);
      original = endState.panes.get('0');
      parent = endState.panes.get(original.parentId);
      added = endState.panes.get(parent.childIds.last());
    });

    it('parent should have two children in correct order', () => {
      expect(parent.childIds.toJS()).toEqual([original.id, added.id]);
    });

    it('parents direction should be col', () => {
      expect(parent.direction).toEqual(COL);
    });
  });

  describe('join last two in row below rood', () => {
    let original, parent, added;
    beforeEach(() => {
      startState = (new Layout())
        .set('rootId', '1')
        .setIn(['panes', '0'], new Pane({
          id: '0',
          childIds: List(),
          isGroup: false,
          direction: undefined,
          parentId: '1',
          splitRatio: 0.25
        }))
        .setIn(['panes', '1'], new Pane({
          id: '1',
          childIds: List(['0', '2']),
          isGroup: true,
          direction: 'ROW',
          parentId: undefined,
          splitRatio: 1
        }))
        .setIn(['panes', '2'], new Pane({
          id: '2',
          childIds: List(),
          isGroup: false,
          direction: undefined,
          parentId: '1',
          splitRatio: 0.75
        }));

      action = {
        type: JOIN,
        removeId: '0',
        retainId: '2'
      };

      endState = PaneReducer(startState, action);
      console.log(endState.toJS());
    });

    it('remaining pane should be root', () => {
      expect(endState.rootId).toEqual('2');
    });

    it('parent pane should be deleted', () => {
      expect(endState.panes.get('1')).toBe(undefined);
    });

    it('removed pane should be deleted', () => {
      expect(endState.panes.get('0')).toBe(undefined);
    });

    it('remaining pane should exist', () => {
      expect(endState.panes.get('2')).toExist();
    });

    it('remaining pane should not have direction', () => {
      expect(endState.panes.get('2').direction).toBe(undefined);
    });

    it('remaining pane should not have parent', () => {
      expect(endState.panes.get('2').parent).toBe(undefined);
    });

  });
});
