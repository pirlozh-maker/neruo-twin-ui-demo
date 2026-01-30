type ToggleProps = {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
};

const Toggle = ({ label, checked, onChange }: ToggleProps) => (
  <label className="flex items-center justify-between gap-3 text-xs text-slate-300">
    <span>{label}</span>
    <button
      type="button"
      className={`h-6 w-11 rounded-full p-1 transition ${
        checked ? "bg-cyan-500" : "bg-slate-700"
      }`}
      onClick={() => onChange(!checked)}
    >
      <span
        className={`block h-4 w-4 rounded-full bg-white transition ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  </label>
);

export default Toggle;
