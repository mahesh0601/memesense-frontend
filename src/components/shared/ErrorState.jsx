export function ErrorState({ title = "Something slipped", message }) {
  return (
    <div className="state-panel state-panel-error" role="alert">
      <h2>{title}</h2>
      <p>{message}</p>
    </div>
  );
}
