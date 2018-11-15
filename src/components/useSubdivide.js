import React, { createContext, useReducer, useContext, useRef } from "react";
import { reducer, createLayout } from "../reducer";
import * as _actions from "../reducer/subdivideActionCreators";

const SubdivideCtx = createContext();

function bindActions(dispatch, actions) {
  const bound = { ...actions };
  for (let key in bound) {
    const fn = bound[key];
    bound[key] = (...args) => dispatch(fn(...args));
  }
  return bound;
}

// bind them
const selectors = {};

export function useSubdivide() {
  return useContext(SubdivideCtx);
}

// children as fn json
export function SubdivideProvider({ initialState = createLayout(), children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const actions = useRef(bindActions(dispatch, _actions));

  return (
    <SubdivideCtx.Provider
      value={{ state, actions: actions.current, selectors }}
    >
      {children}
    </SubdivideCtx.Provider>
  );
}
