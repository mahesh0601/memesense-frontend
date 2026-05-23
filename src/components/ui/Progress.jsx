export function Progress({ value, max = 100, label }) {
  return (
    <label className="progress-label">
      {label ? <span>{label}</span> : null}
      <progress value={value} max={max} />
    </label>
  );
}
