import { Suspense } from "react";
import AboutPage from "./AboutPage";
import AboutTeam from "./AboutTeam";
import LanguageSwitcher from "../LanguageSwitcher";

function TeamLoading() {
  return (
    <div className="flex min-h-40 items-center justify-center gap-2 border border-slate-200 bg-white text-sm text-slate-500">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-700 border-t-transparent" />
      
    </div>
  );
}

export default function AboutUsPage() {
  return (
    <AboutPage>
      <Suspense fallback={<TeamLoading />}>
        <AboutTeam />
        <div className="fixed right-4 bottom-1/2 z-9999 -translate-y-1/2">
          <LanguageSwitcher />
        </div>
      </Suspense>
    </AboutPage>
  );
}
