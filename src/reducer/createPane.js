export function createPane({
  id = "0",
  isGroup = false,
  childIds = [],
  splitRatio = 1,
  props = {},
  ...rest
} = {}) {
  return {
    id,
    isGroup,
    childIds,
    splitRatio,
    props,
    direction: undefined,
    parentId: undefined,

    top: undefined,
    left: undefined,
    width: undefined,
    height: undefined,
    canSplit: undefined,
    joinDirection: undefined,
    ...rest
  };
}
