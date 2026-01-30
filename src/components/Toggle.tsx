type ToggleProps = {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
};

import { useAppStore } from "../state/store";

const Toggle = ({ label, checked, onChange }: ToggleProps) => {
  const pushToast = useAppStore((state) => state.pushToast);

  return (
    <label className="flex items-center justify-between gap-3 text-xs text-slate-300">
      <span>{label}</span>
      <button
        type="button"
        className={`h-6 w-11 rounded-full p-1 transition ${
          checked ? "bg-cyan-500" : "bg-slate-700"
        }`}
        onClick={() => {
          onChange(!checked);
          pushToast({
            id: `toast_toggle_${Date.now()}`,
            title: `${label} ${!checked ? "enabled" : "disabled"}`,
            description: "Toggle updated.",
            tone: "info",
          });
        }}
      >
        <span
          className={`block h-4 w-4 rounded-full bg-white transition ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </label>
  );
};

export default Toggle;
