export function CaptionIdeaCard({ idea, isSelected, onSelect }) {
  return (
    <button
      className={`caption-idea-card caption-card ${isSelected ? "caption-idea-card-selected caption-card-selected selected" : ""}`}
      onClick={onSelect}
      type="button"
    >
      <span className="result-tag">{idea.tag}</span>
      {isSelected ? <span className="selected-pill">Selected</span> : null}
      <strong>{idea.title}</strong>
      <small>
        {idea.topText} / {idea.bottomText}
      </small>
    </button>
  );
}
