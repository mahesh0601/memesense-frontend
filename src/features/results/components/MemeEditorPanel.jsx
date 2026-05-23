export function MemeEditorPanel({
  bottomText,
  fontStyle,
  outlineColor,
  positionMode,
  setBottomText,
  setFontStyle,
  setOutlineColor,
  setPositionMode,
  setTextColor,
  setTopText,
  textColor,
  topText,
}) {
  return (
    <section className="meme-editor-panel" aria-label="Tweak the damage">
      <div>
        <p className="sample-panel-title">Tweak the damage</p>
        <p className="editor-note">Small changes. Maximum consequences.</p>
      </div>

      <label className="editor-field">
        <span>Top text</span>
        <input value={topText} onChange={(event) => setTopText(event.target.value)} />
      </label>

      <label className="editor-field">
        <span>Bottom text</span>
        <input
          value={bottomText}
          onChange={(event) => setBottomText(event.target.value)}
        />
      </label>

      <div className="editor-select-grid">
        <label className="editor-field">
          <span>Font style</span>
          <select
            value={fontStyle}
            onChange={(event) => setFontStyle(event.target.value)}
          >
            <option value="classic">Classic</option>
            <option value="bold">Bold</option>
            <option value="clean">Clean</option>
          </select>
        </label>

        <label className="editor-field">
          <span>Text color</span>
          <select
            value={textColor}
            onChange={(event) => setTextColor(event.target.value)}
          >
            <option value="white">White</option>
            <option value="black">Black</option>
            <option value="yellow">Yellow</option>
          </select>
        </label>

        <label className="editor-field">
          <span>Outline</span>
          <select
            value={outlineColor}
            onChange={(event) => setOutlineColor(event.target.value)}
          >
            <option value="black">Black</option>
            <option value="white">White</option>
            <option value="none">None</option>
          </select>
        </label>

        <label className="editor-field">
          <span>Position</span>
          <select
            value={positionMode}
            onChange={(event) => setPositionMode(event.target.value)}
          >
            <option value="top-bottom">Top + Bottom</option>
            <option value="top-only">Top only</option>
            <option value="bottom-only">Bottom only</option>
          </select>
        </label>
      </div>
    </section>
  );
}
