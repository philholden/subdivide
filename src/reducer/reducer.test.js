import { reducer } from "./reducer";
import { createPane } from "./createPane";
import { createLayout } from "./createLayout";
import {
  CHILD_ABOVE,
  CHILD_BELOW,
  CHILD_LEFT,
  CHILD_RIGHT,
  ROW,
  COL,
  SPLIT,
  JOIN
} from "./constants";

describe("pane reducer", () => {
  let startState, endState, action;

  beforeEach(() => {
    startState = {
      panes: {}
    };
  });

  describe("split right", () => {
    let original, parent, added;
    beforeEach(() => {
      startState = createLayout();

      action = {
        type: SPLIT,
        id: "0",
        splitType: CHILD_RIGHT
      };

      endState = reducer(startState, action);
      original = endState.panes["0"];
      parent = endState.panes[original.parentId];
      //console.log(original, parent)
      added = endState.panes[parent.childIds[parent.childIds.length - 1]];
    });

    it("parent should be added", () => {
      expect(parent).toBeDefined();
    });

    it("new child should be added", () => {
      expect(added).toBeDefined();
    });

    it("parent should have two children in correct order", () => {
      expect(parent.childIds).toEqual([original.id, added.id]);
    });

    it("parents direction should be row", () => {
      expect(parent.direction).toEqual(ROW);
    });

    it("original and added should have parent as parent", () => {
      expect(original.parentId).toEqual(parent.id);
      expect(added.parentId).toEqual(parent.id);
    });
  });

  describe("split left", () => {
    let original, parent, added;
    beforeEach(() => {
      startState = createLayout();

      action = {
        type: SPLIT,
        id: "0",
        splitType: CHILD_LEFT
      };

      endState = reducer(startState, action);
      original = endState.panes["0"];
      parent = endState.panes[original.parentId];
      added = endState.panes[parent.childIds[0]];
    });

    it("parent should have two children in correct order", () => {
      expect(parent.childIds).toEqual([added.id, original.id]);
    });

    it("parents direction should be row", () => {
      expect(parent.direction).toEqual(ROW);
    });
  });

  describe("split above", () => {
    let original, parent, added;
    beforeEach(() => {
      startState = createLayout();

      action = {
        type: SPLIT,
        id: "0",
        splitType: CHILD_ABOVE
      };

      endState = reducer(startState, action);
      original = endState.panes["0"];
      parent = endState.panes[original.parentId];
      added = endState.panes[parent.childIds[0]];
    });

    it("parent should have two children in correct order", () => {
      expect(parent.childIds).toEqual([added.id, original.id]);
    });

    it("parents direction should be col", () => {
      expect(parent.direction).toEqual(COL);
    });
  });

  describe("split below", () => {
    let original, parent, added;
    beforeEach(() => {
      startState = createLayout();

      action = {
        type: SPLIT,
        id: "0",
        splitType: CHILD_BELOW
      };

      endState = reducer(startState, action);
      original = endState.panes["0"];
      parent = endState.panes[original.parentId];
      added = endState.panes[parent.childIds[parent.childIds.length - 1]];
    });

    it("parent should have two children in correct order", () => {
      expect(parent.childIds).toEqual([original.id, added.id]);
    });

    it("parents direction should be col", () => {
      expect(parent.direction).toEqual(COL);
    });
  });

  describe("join one of two in row below root", () => {
    beforeEach(() => {
      startState = createLayout({
        rootId: "1",
        panes: {
          "0": createPane({
            id: "0",
            childIds: [],
            isGroup: false,
            direction: undefined,
            parentId: "1",
            splitRatio: 0.25
          }),
          "1": createPane({
            id: "1",
            childIds: ["0", "2"],
            isGroup: true,
            direction: "ROW",
            parentId: undefined,
            splitRatio: 1
          }),
          "2": createPane({
            id: "2",
            childIds: [],
            isGroup: false,
            direction: undefined,
            parentId: "1",
            splitRatio: 0.75
          })
        }
      });

      action = {
        type: JOIN,
        removeId: "0",
        retainId: "2"
      };

      endState = reducer(startState, action);
    });

    it("remaining pane should be root", () => {
      expect(endState.rootId).toEqual("2");
    });

    it("parent pane should be deleted", () => {
      expect(endState.panes["1"]).toBe(undefined);
    });

    it("removed pane should be deleted", () => {
      expect(endState.panes["0"]).toBe(undefined);
    });

    it("remaining pane should exist", () => {
      expect(endState.panes["2"]).toBeDefined();
    });

    it("remaining pane should not have direction", () => {
      expect(endState.panes["2"].direction).toBe(undefined);
    });

    it("remaining pane should not have parent", () => {
      expect(endState.panes["2"].parent).toBe(undefined);
    });
  });

  describe("join one of three in row below root", () => {
    beforeEach(() => {
      startState = createLayout({
        rootId: "1",
        panes: {
          "0": createPane({
            id: "0",
            childIds: [],
            isGroup: false,
            direction: undefined,
            parentId: "1",
            splitRatio: 0.33
          }),
          "1": createPane({
            id: "1",
            childIds: ["0", "2", "3"],
            isGroup: true,
            direction: "ROW",
            parentId: undefined,
            splitRatio: 1
          }),
          "2": createPane({
            id: "2",
            childIds: [],
            isGroup: false,
            direction: undefined,
            parentId: "1",
            splitRatio: 0.33
          }),
          "3": createPane({
            id: "3",
            childIds: [],
            isGroup: false,
            direction: undefined,
            parentId: "1",
            splitRatio: 0.33
          })
        }
      });

      action = {
        type: JOIN,
        removeId: "0",
        retainId: "2"
      };

      endState = reducer(startState, action);
    });

    it("root should be unchanged", () => {
      expect(endState.rootId).toEqual("1");
    });

    it("parent pane should not be deleted", () => {
      expect(endState.panes["1"]).toBeDefined();
    });

    it("parent pane should have 2 children", () => {
      expect(endState.panes["1"].childIds).toEqual(["2", "3"]);
    });

    it("removed pane should be deleted", () => {
      expect(endState.panes["0"]).toBe(undefined);
    });

    it("remaining pane should exist", () => {
      expect(endState.panes["2"]).toBeDefined();
    });

    it("remaining pane should have parent", () => {
      expect(endState.panes["2"].parentId).toBe("1");
    });
  });

  describe("join one of two in row below root", () => {
    beforeEach(() => {
      startState = createLayout({
        rootId: "1",
        panes: {
          "0": createPane({
            id: "0",
            childIds: [],
            isGroup: false,
            direction: undefined,
            parentId: "1",
            splitRatio: 0.25
          }),
          "1": createPane({
            id: "1",
            childIds: ["0", "2"],
            isGroup: true,
            direction: "ROW",
            parentId: undefined,
            splitRatio: 1
          }),
          "2": createPane({
            id: "2",
            childIds: ["3", "4"],
            isGroup: true,
            direction: undefined,
            parentId: "1",
            splitRatio: 0.75
          }),
          "3": createPane({
            id: "3",
            childIds: [],
            isGroup: false,
            direction: undefined,
            parentId: "2",
            splitRatio: 0.75
          }),
          "4": createPane({
            id: "4",
            childIds: [],
            isGroup: false,
            direction: undefined,
            parentId: "2",
            splitRatio: 0.75
          })
        }
      });

      action = {
        type: JOIN,
        removeId: "4",
        retainId: "3"
      };

      endState = reducer(startState, action);
      //console.log(endState)
    });

    it("parent should be deleted", () => {
      expect(endState.panes["2"]).toBe(undefined);
    });

    it("remaining should be added to grandparents children", () => {
      expect(endState.panes["1"].childIds).toEqual(["0", "3"]);
    });

    it("remaining parent should be previous grandparent", () => {
      expect(endState.panes["3"].parentId).toEqual("1");
    });

    it("removed pane should be deleted", () => {
      expect(endState.panes["4"]).toBe(undefined);
    });

    it("remaining pane should exist", () => {
      expect(endState.panes["3"]).toBeDefined();
    });

    it("remaining pane should not have direction", () => {
      expect(endState.panes["3"].direction).toBe(undefined);
    });
  });
});
