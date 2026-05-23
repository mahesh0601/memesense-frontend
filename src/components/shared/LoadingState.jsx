import { Spinner } from "../ui/Spinner";

export function LoadingState({ label = "Loading..." }) {
  return (
    <div className="state-panel">
      <Spinner />
      <p>{label}</p>
    </div>
  );
}
