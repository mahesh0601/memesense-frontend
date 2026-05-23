const colorMap = {
  white: "#ffffff",
  black: "#151515",
  yellow: "#fff275",
};

const outlineMap = {
  black: "#000000",
  white: "#ffffff",
  none: "transparent",
};

function getOutlineShadow(outlineColor) {
  if (outlineColor === "none") {
    return "0 3px 12px rgba(0, 0, 0, 0.34)";
  }

  const color = outlineMap[outlineColor];
  return [
    `2px 2px 0 ${color}`,
    `-2px 2px 0 ${color}`,
    `2px -2px 0 ${color}`,
    `-2px -2px 0 ${color}`,
    "0 4px 14px rgba(0, 0, 0, 0.34)",
  ].join(", ");
}

export function MemePreview({
  bottomText,
  fontStyle,
  image,
  outlineColor,
  positionMode,
  selectedIdeaTitle,
  textColor,
  topText,
}) {
  const textStyle = {
    color: colorMap[textColor],
    textShadow: getOutlineShadow(outlineColor),
  };
  const showTop = positionMode !== "bottom-only";
  const showBottom = positionMode !== "top-only";

  return (
    <section className="meme-preview-panel meme-preview-card" aria-label="Live meme preview">
      <p className="sample-panel-title preview-label">Live meme preview</p>
      <div className={`meme-preview-frame meme-font-${fontStyle}`}>
        <img
          alt={`Meme preview using ${image.fileName}`}
          src={image.previewUrl}
          className="meme-image"
        />
        {showTop ? (
          <p className="meme-text meme-text-top" style={textStyle}>
            {topText}
          </p>
        ) : null}
        {showBottom ? (
          <p className="meme-text meme-text-bottom" style={textStyle}>
            {bottomText}
          </p>
        ) : null}
      </div>
      <div className="preview-meta">
        <p className="selected-idea-label">Selected: {selectedIdeaTitle}</p>
        <p className="meme-preview-helper">This is a preview only. Export comes next.</p>
      </div>
    </section>
  );
}
