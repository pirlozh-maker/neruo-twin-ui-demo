import { useState } from "react";
import Toggle from "../components/Toggle";
import { useAppStore } from "../state/store";

const SignalHealthPanel = () => {
  const [eegQc, setEegQc] = useState(true);
  const [emgQc, setEmgQc] = useState(false);
  const [imuQc, setImuQc] = useState(true);
  const [lastRun, setLastRun] = useState<string>("Idle");
  const pushToast = useAppStore((state) => state.pushToast);

  const handleRun = () => {
    setLastRun("Running...");
    setTimeout(() => setLastRun(new Date().toLocaleTimeString()), 400);
    pushToast({
      id: `toast_qc_${Date.now()}`,
      title: "QC scan executed",
      description: "Signal health refresh complete.",
      tone: "info",
    });
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-xs">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Signal Health</h3>
        <span className="text-[11px] text-slate-500">Last: {lastRun}</span>
      </div>
      <div className="mt-3 space-y-2">
        <Toggle label="EEG QC" checked={eegQc} onChange={setEegQc} />
        <Toggle label="EMG QC" checked={emgQc} onChange={setEmgQc} />
        <Toggle label="IMU QC" checked={imuQc} onChange={setImuQc} />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button className="rounded-lg border border-slate-700 px-3 py-1" onClick={handleRun}>
          Run QC
        </button>
        <button
          className="rounded-lg border border-slate-700 px-3 py-1"
          onClick={() => {
            setEegQc(true);
            setEmgQc(false);
            setImuQc(true);
            setLastRun("Reset");
            pushToast({
              id: `toast_qc_reset_${Date.now()}`,
              title: "QC toggles reset",
              description: "Returned to default QC channels.",
              tone: "warning",
            });
          }}
        >
          Reset Toggles
        </button>
      </div>
    </section>
  );
};

export default SignalHealthPanel;
