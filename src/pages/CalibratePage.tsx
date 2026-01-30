import { useAppStore } from "../state/store";

const CalibratePage = () => {
  const { calibrationVersion, setCalibrationVersion, pushToast } = useAppStore();

  return (
    <div className="space-y-4 p-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
        <h2 className="text-sm font-semibold">Calibration Workspace</h2>
        <p className="mt-2 text-xs text-slate-400">
          Use correction clips + prior settings to personalize the twin. Calibration hints will
          adjust future preview/bake outputs with a new calibration version.
        </p>
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-xs text-slate-300">
        <div className="flex items-center justify-between">
          <span className="font-semibold">Active calibration</span>
          <span className="text-[11px] text-slate-500">{calibrationVersion}</span>
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
            <div className="text-[11px] text-slate-500">Profile Snapshot</div>
            <div className="mt-2 space-y-1 text-slate-300">
              <div>Alignment: 0.82</div>
              <div>Gain shift: +3.2%</div>
              <div>Latency offset: -24ms</div>
            </div>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
            <div className="text-[11px] text-slate-500">Next Suggestion</div>
            <div className="mt-2 text-slate-300">
              Apply a new calibration run after saving corrections.
            </div>
            <button
              className="mt-3 rounded-lg border border-slate-700 px-3 py-1"
              onClick={() => {
                setCalibrationVersion(`calib_${Date.now()}`);
                pushToast({
                  id: `toast_calib_refresh_${Date.now()}`,
                  title: "Calibration refreshed",
                  description: "Calibration snapshot updated.",
                  tone: "success",
                });
              }}
            >
              Refresh calibration snapshot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalibratePage;
