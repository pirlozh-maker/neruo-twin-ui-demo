import { ChangeEvent } from "react";
import { useAppStore } from "../state/store";
import type { Macro, Recipe } from "../types";
import { downloadJson } from "../utils/exporters";

const mergeRecipePatch = (base: Macro["recipePatch"]) => base;

const diffRecipe = (before: Recipe, after: Recipe, patch: Partial<Recipe>) => {
  const changes: string[] = [];
  const sections: Array<keyof Recipe> = ["eeg", "emg", "sync", "prior", "output"];
  sections.forEach((section) => {
    const patchSection = patch[section];
    if (!patchSection) return;
    Object.entries(patchSection).forEach(([key, value]) => {
      const beforeValue = (before[section] as Record<string, unknown>)[key];
      const afterValue = (after[section] as Record<string, unknown>)[key];
      if (beforeValue !== afterValue) {
        changes.push(
          `${section}.${key}: ${JSON.stringify(beforeValue)} → ${JSON.stringify(afterValue)}`,
        );
      }
    });
  });
  return changes;
};

const MacroDock = () => {
  const {
    macros,
    setMacros,
    activeMacroId,
    setActiveMacroId,
    recipe,
    setRecipe,
    macroChangeLog,
    setMacroChangeLog,
    pushToast,
  } = useAppStore();

  const handleApply = () => {
    const macro = macros.find((item) => item.id === activeMacroId);
    if (!macro) return;
    const patch = mergeRecipePatch(macro.recipePatch);
    const nextRecipe = {
      ...recipe,
      ...patch,
      eeg: { ...recipe.eeg, ...patch.eeg },
      emg: { ...recipe.emg, ...patch.emg },
      sync: { ...recipe.sync, ...patch.sync },
      prior: { ...recipe.prior, ...patch.prior },
      output: { ...recipe.output, ...patch.output },
    };
    const changes = diffRecipe(recipe, nextRecipe, patch);
    setRecipe(nextRecipe);
    setMacroChangeLog([
      `Applied ${macro.name} (${changes.length} changes)`,
      ...changes,
    ]);
    pushToast({
      id: `toast_macro_${Date.now()}`,
      title: "Macro applied",
      description: macro.name,
      tone: "success",
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
        pushToast({
          id: `toast_macro_import_${Date.now()}`,
          title: "Macros imported",
          description: `Loaded ${json.length} macros.`,
          tone: "success",
        });
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
        <button
          className="text-cyan-300"
          onClick={() => {
            downloadJson("macros.json", macros);
            pushToast({
              id: `toast_macro_export_${Date.now()}`,
              title: "Macros exported",
              description: "macros.json saved.",
              tone: "info",
            });
          }}
        >
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
        {macroChangeLog.length > 0 && (
          <div className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-[11px] text-slate-400">
            <div className="font-semibold text-slate-300">Change Log</div>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              {macroChangeLog.slice(0, 6).map((item, index) => (
                <li key={`${item}-${index}`}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default MacroDock;
