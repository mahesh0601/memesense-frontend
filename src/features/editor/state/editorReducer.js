export function editorReducer(draft, action) {
  switch (action.type) {
    case "SELECT_LAYER":
      return { ...draft, selectedLayerId: action.layerId };
    case "UPDATE_TEXT":
      return {
        ...draft,
        layers: draft.layers.map((layer) =>
          layer.type === "text" && layer.id === action.layerId
            ? { ...layer, text: action.text }
            : layer,
        ),
      };
    case "MOVE_LAYER":
      return {
        ...draft,
        layers: draft.layers.map((layer) =>
          layer.id === action.layerId ? { ...layer, x: action.x, y: action.y } : layer,
        ),
      };
    case "RESET_DRAFT":
      return action.draft;
    default:
      return draft;
  }
}
