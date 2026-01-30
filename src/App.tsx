import HeaderBar from "./features/HeaderBar";
import ToastStack from "./components/ToastStack";
import SideRail from "./components/SideRail";
import StudioPage from "./pages/StudioPage";
import ScenarioPage from "./pages/ScenarioPage";
import CalibratePage from "./pages/CalibratePage";
import RunsPage from "./pages/RunsPage";
import ExportReportsPage from "./pages/ExportReportsPage";
import { useAppStore } from "./state/store";

const App = () => {
  const activePage = useAppStore((state) => state.activePage);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <HeaderBar />
      <div className="flex min-h-[calc(100vh-80px)]">
        <SideRail />
        <main className="flex-1">
          {activePage === "studio" && <StudioPage />}
          {activePage === "scenario" && <ScenarioPage />}
          {activePage === "calibrate" && <CalibratePage />}
          {activePage === "runs" && <RunsPage />}
          {activePage === "export" && <ExportReportsPage />}
        </main>
      </div>
      <ToastStack />
    </div>
  );
};

export default App;
