import { createPane } from "./createPane";

export const createLayout = props => ({
  rootId: "0",
  //  dividerSize: 3,
  borderSize: 1,
  cellSpacing: 3,
  touchMargin: 2,
  borderColor: "#c0c0d0",
  cellSpaceColor: "#e0e0e0",
  mode: undefined,
  dividerDown: undefined,
  cornerDown: undefined,
  cornerHover: undefined,
  width: 800,
  height: 600,
  panes: {
    "0": createPane()
  },
  allPanesIdsEver: ["0"],
  dividers: {},
  ...props
});
