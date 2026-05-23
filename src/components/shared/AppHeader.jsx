import { navigateTo } from "../../app/router/navigation";

export function AppHeader() {
  return (
    <header className="app-header">
      <button
        className="brand-mark"
        type="button"
        onClick={() => navigateTo("/")}
        aria-label="MemeSense home"
      >
        <span className="brand-icon">✨</span>
        <span>
          <strong>MemeSense</strong>
          <small>Upload a photo. AI finds the joke.</small>
        </span>
      </button>
    </header>
  );
}
