import React from "react";
import { useSubdivide } from "./useSubdivide";
import { Layout } from "./Layout";

export function Subdivide(props) {
  const { state, actions, selectors } = useSubdivide();
  return <Layout {...{ actions, store: state, selectors, ...props }} />;
}
