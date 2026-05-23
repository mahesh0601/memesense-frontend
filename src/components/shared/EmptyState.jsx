export function EmptyState({ title, message }) {
  return (
    <div className="state-panel">
      <h2>{title}</h2>
      {message ? <p>{message}</p> : null}
    </div>
  );
}
