import React, { createContext, useContext } from "react";

const PaneCtx = createContext();

export function usePane() {
  const pane = useContext(PaneCtx);
  return pane;
}

export function PaneProvider({ value, children }) {
  return <PaneCtx.Provider value={value}>{children}</PaneCtx.Provider>;
}
