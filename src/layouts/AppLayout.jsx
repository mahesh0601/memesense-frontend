import { AppFooter } from "../components/shared/AppFooter";
import { AppHeader } from "../components/shared/AppHeader";

export function AppLayout({ children }) {
  return (
    <div className="app-shell">
      <AppHeader />
      <main className="app-main">{children}</main>
      <AppFooter />
    </div>
  );
}
