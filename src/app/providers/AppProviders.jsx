import { MemeFlowProvider } from "../../state/MemeFlowContext.jsx";

export function AppProviders({ children }) {
  return <MemeFlowProvider>{children}</MemeFlowProvider>;
}
