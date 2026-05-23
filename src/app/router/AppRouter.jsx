import { useEffect, useState } from "react";
import { AppLayout } from "../../layouts/AppLayout";
import { CookingLoadingScreen } from "../../features/cooking/CookingLoadingScreen";
import { EditorPage } from "../../features/editor/EditorPage";
import { HomePage } from "../../features/home/HomePage";
import { CreatorReactionDashboard } from "../../features/reactions/CreatorReactionDashboard";
import { PublicMemePage } from "../../features/reactions/PublicMemePage";
import { ResultsPage } from "../../features/results/ResultsPage";
import { SharePage } from "../../features/share/SharePage";
import { SuggestionsPage } from "../../features/suggestions/SuggestionsPage";
import { UploadPage } from "../../features/upload/UploadPage";

export function AppRouter() {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    function handleLocationChange() {
      setPathname(window.location.pathname);
    }

    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  return (
    <AppLayout>
      <RouteContent pathname={pathname} />
    </AppLayout>
  );
}

function RouteContent({ pathname }) {
  if (pathname === "/") {
    return <HomePage />;
  }

  if (pathname === "/upload") {
    return <UploadPage />;
  }

  if (pathname === "/cooking") {
    return <CookingLoadingScreen />;
  }

  if (pathname === "/results") {
    return <ResultsPage />;
  }

  if (pathname === "/create") {
    return <SuggestionsPage />;
  }

  if (pathname.startsWith("/editor/")) {
    return <EditorPage />;
  }

  if (pathname.startsWith("/share/")) {
    return <SharePage />;
  }

  if (pathname.startsWith("/m/")) {
    return <PublicMemePage />;
  }

  if (pathname.startsWith("/dashboard/")) {
    return <CreatorReactionDashboard />;
  }

  return <HomePage />;
}
