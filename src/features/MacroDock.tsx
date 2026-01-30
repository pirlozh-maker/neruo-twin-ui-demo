import { ChangeEvent } from "react";
import { useAppStore } from "../state/store";
import type { Macro } from "../types";
import { downloadJson } from "../utils/exporters";

const mergeRecipePatch = (base: Macro["recipePatch"]) => base;

const MacroDock = () => {
  const { macros, setMacros, activeMacroId, setActiveMacroId, recipe, setRecipe } = useAppStore();

  const handleApply = () => {
    const macro = macros.find((item) => item.id === activeMacroId);
    if (!macro) return;
    const patch = mergeRecipePatch(macro.recipePatch);
    setRecipe({
      ...recipe,
      ...patch,
      eeg: { ...recipe.eeg, ...patch.eeg },
      emg: { ...recipe.emg, ...patch.emg },
      sync: { ...recipe.sync, ...patch.sync },
      prior: { ...recipe.prior, ...patch.prior },
      output: { ...recipe.output, ...patch.output },
    });
  };

  const handleLoad = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(String(reader.result)) as Macro[];
        setMacros(json);
        setActiveMacroId(json[0]?.id ?? null);
      } catch (error) {
        console.error(error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3 text-xs">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-100">Macro Dock</span>
        <button className="text-cyan-300" onClick={() => downloadJson("macros.json", macros)}>
          Export
        </button>
      </div>
      <div className="mt-2 grid gap-2">
        <select
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2"
          value={activeMacroId ?? ""}
          onChange={(event) => setActiveMacroId(event.target.value || null)}
        >
          <option value="">Select a macro…</option>
          {macros.map((macro) => (
            <option key={macro.id} value={macro.id}>
              {macro.name}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <button
            className="flex-1 rounded-lg border border-slate-700 px-3 py-2"
            onClick={handleApply}
          >
            Apply Macro
          </button>
          <label className="flex-1 cursor-pointer rounded-lg border border-dashed border-slate-600 px-3 py-2 text-center">
            Import
            <input type="file" className="hidden" onChange={handleLoad} />
          </label>
        </div>
        {activeMacroId && (
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-[11px] text-slate-400">
            {macros.find((item) => item.id === activeMacroId)?.description}
          </div>
        )}
      </div>
    </div>
  );
};

export default MacroDock;
