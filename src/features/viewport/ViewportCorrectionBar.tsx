import Toggle from "../../components/Toggle";

type Props = {
  correctionMode: boolean;
  correctionApplyMode: "local_fix" | "calibrate_hint";
  onToggleMode: (value: boolean) => void;
  onApplyModeChange: (value: "local_fix" | "calibrate_hint") => void;
  onSave: () => void;
};

const ViewportCorrectionBar = ({
  correctionMode,
  correctionApplyMode,
  onToggleMode,
  onApplyModeChange,
  onSave,
}: Props) => (
  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
    <Toggle label="Edit Twin Pose" checked={correctionMode} onChange={onToggleMode} />
    <select
      className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1"
      value={correctionApplyMode}
      onChange={(event) => onApplyModeChange(event.target.value as "local_fix" | "calibrate_hint")}
    >
      <option value="local_fix">local_fix</option>
      <option value="calibrate_hint">calibrate_hint</option>
    </select>
    <button className="rounded-lg border border-slate-700 px-3 py-1" onClick={onSave}>
      Save Correction
    </button>
  </div>
);

export default ViewportCorrectionBar;
