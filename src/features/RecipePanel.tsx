import { ChangeEvent } from "react";
import Accordion from "../components/Accordion";
import Slider from "../components/Slider";
import Toggle from "../components/Toggle";
import { presets, CHANNELS_64 } from "../utils/recipes";
import { useAppStore } from "../state/store";
import type { Recipe } from "../types";
import { downloadJson } from "../utils/exporters";

const RecipePanel = () => {
  const { recipe, setRecipe, resetRecipe, mode } = useAppStore();
  const isLab = mode === "lab";

  const updateRecipe = (next: Recipe) => setRecipe(next);

  const handleNoiseType = (value: "white" | "1f") =>
    updateRecipe({
      ...recipe,
      eeg: {
        ...recipe.eeg,
        noise_type: value,
      },
    });

  const handleMaskMode = (value: "group" | "explicit") =>
    updateRecipe({
      ...recipe,
      eeg: {
        ...recipe.eeg,
        channel_mask: { ...recipe.eeg.channel_mask, mode: value },
      },
    });

  const handleGroups = (group: Recipe["eeg"]["channel_mask"]["groups"][number]) => {
    const groups = recipe.eeg.channel_mask.groups.includes(group)
      ? recipe.eeg.channel_mask.groups.filter((item) => item !== group)
      : [...recipe.eeg.channel_mask.groups, group];
    updateRecipe({
      ...recipe,
      eeg: {
        ...recipe.eeg,
        channel_mask: { ...recipe.eeg.channel_mask, groups },
      },
    });
  };

  const handleExplicitChannels = (channel: string) => {
    const explicit = recipe.eeg.channel_mask.explicit.includes(channel)
      ? recipe.eeg.channel_mask.explicit.filter((item) => item !== channel)
      : [...recipe.eeg.channel_mask.explicit, channel];
    updateRecipe({
      ...recipe,
      eeg: {
        ...recipe.eeg,
        channel_mask: { ...recipe.eeg.channel_mask, explicit },
      },
    });
  };

  const handleEmgGain = (index: number, value: number) => {
    const gain = recipe.emg.gain.map((item, i) => (i === index ? value : item));
    updateRecipe({ ...recipe, emg: { ...recipe.emg, gain } });
  };

  const handleFileLoad = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(String(reader.result)) as Recipe;
        setRecipe(json);
      } catch (error) {
        console.error(error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Recipe (Kitchen)</h2>
        <button
          className="text-xs text-cyan-300"
          onClick={() => downloadJson("recipe.json", recipe)}
        >
          Save JSON
        </button>
      </div>
      <Accordion title="EEG">
        <div className="space-y-2">
          <div className="text-xs text-slate-400">noise_type</div>
          <div className="flex gap-2">
            {(["white", "1f"] as const).map((value) => (
              <button
                key={value}
                className={`rounded-lg border px-3 py-1 text-xs ${
                  recipe.eeg.noise_type === value
                    ? "border-cyan-500 bg-cyan-500/30 text-white"
                    : "border-slate-700 text-slate-300"
                }`}
                onClick={() => handleNoiseType(value)}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
        <Slider
          label="noise_sigma"
          value={recipe.eeg.noise_sigma}
          min={0}
          max={3}
          step={0.1}
          onChange={(value) =>
            updateRecipe({
              ...recipe,
              eeg: { ...recipe.eeg, noise_sigma: value },
            })
          }
        />
        <div className="space-y-2">
          <div className="text-xs text-slate-400">channel_mask.mode</div>
          <div className="flex gap-2">
            {(["group", "explicit"] as const).map((value) => (
              <button
                key={value}
                className={`rounded-lg border px-3 py-1 text-xs ${
                  recipe.eeg.channel_mask.mode === value
                    ? "border-cyan-500 bg-cyan-500/30 text-white"
                    : "border-slate-700 text-slate-300"
                }`}
                onClick={() => handleMaskMode(value)}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
        {recipe.eeg.channel_mask.mode === "group" ? (
          <div className="grid grid-cols-2 gap-2 text-xs">
            {(["motor_strip_left", "motor_strip_right", "left_hemi", "right_hemi"] as const).map(
              (group) => (
                <label key={group} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={recipe.eeg.channel_mask.groups.includes(group)}
                    onChange={() => handleGroups(group)}
                  />
                  {group}
                </label>
              ),
            )}
          </div>
        ) : (
          <div className="grid max-h-32 grid-cols-4 gap-2 overflow-auto text-xs">
            {CHANNELS_64.map((channel) => (
              <label key={channel} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={recipe.eeg.channel_mask.explicit.includes(channel)}
                  onChange={() => handleExplicitChannels(channel)}
                />
                {channel}
              </label>
            ))}
          </div>
        )}
      </Accordion>
      <Accordion title="EMG (Lab only)">
        {!isLab && (
          <div className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-400">
            Switch to Lab mode to edit EMG parameters.
          </div>
        )}
        <Toggle
          label="enabled"
          checked={isLab && recipe.emg.enabled}
          onChange={(value) => {
            if (!isLab) return;
            updateRecipe({
              ...recipe,
              emg: { ...recipe.emg, enabled: value },
            });
          }}
        />
        <div className="grid grid-cols-2 gap-3">
          {recipe.emg.gain.map((gain, index) => (
            <Slider
              key={`gain-${index}`}
              label={`gain[${index + 1}]`}
              value={gain}
              min={0.5}
              max={2}
              step={0.05}
              onChange={(value) => isLab && handleEmgGain(index, value)}
            />
          ))}
        </div>
        <Slider
          label="delay_ms"
          value={recipe.emg.delay_ms}
          min={0}
          max={200}
          step={5}
          onChange={(value) =>
            isLab &&
            updateRecipe({
              ...recipe,
              emg: { ...recipe.emg, delay_ms: value },
            })
          }
        />
      </Accordion>
      <Accordion title="Sync">
        <Slider
          label="jitter_ms"
          value={recipe.sync.jitter_ms}
          min={0}
          max={50}
          step={1}
          onChange={(value) =>
            updateRecipe({
              ...recipe,
              sync: { ...recipe.sync, jitter_ms: value },
            })
          }
        />
        <Slider
          label="dropout_rate"
          value={recipe.sync.dropout_rate}
          min={0}
          max={0.3}
          step={0.01}
          onChange={(value) =>
            updateRecipe({
              ...recipe,
              sync: { ...recipe.sync, dropout_rate: value },
            })
          }
        />
      </Accordion>
      <Accordion title="Prior">
        <Slider
          label="skeleton_strength"
          value={recipe.prior.skeleton_strength}
          min={0}
          max={1}
          step={0.05}
          onChange={(value) =>
            updateRecipe({
              ...recipe,
              prior: { ...recipe.prior, skeleton_strength: value },
            })
          }
        />
        <Slider
          label="dynamics_smoothness"
          value={recipe.prior.dynamics_smoothness}
          min={0}
          max={1}
          step={0.05}
          onChange={(value) =>
            updateRecipe({
              ...recipe,
              prior: { ...recipe.prior, dynamics_smoothness: value },
            })
          }
        />
      </Accordion>
      <Accordion title="Output">
        <div className="flex gap-2">
          {(["preview", "bake"] as const).map((value) => (
            <button
              key={value}
              className={`rounded-lg border px-3 py-1 text-xs ${
                recipe.output.quality === value
                  ? "border-cyan-500 bg-cyan-500/30 text-white"
                  : "border-slate-700 text-slate-300"
              }`}
              onClick={() =>
                updateRecipe({
                  ...recipe,
                  output: { ...recipe.output, quality: value },
                })
              }
            >
              {value}
            </button>
          ))}
        </div>
      </Accordion>
      <div className="space-y-2 text-xs">
        <div className="flex flex-wrap gap-2">
          <label className="cursor-pointer rounded-lg border border-dashed border-slate-600 px-3 py-2">
            Load Recipe JSON
            <input type="file" className="hidden" onChange={handleFileLoad} />
          </label>
          <button
            className="rounded-lg border border-slate-700 px-3 py-2"
            onClick={() => downloadJson("recipe.json", recipe)}
          >
            Save Recipe JSON
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.keys(presets).map((key) => (
            <button
              key={key}
              className="rounded-lg border border-slate-700 px-3 py-2"
              onClick={() => setRecipe(presets[key])}
            >
              Preset: {key}
            </button>
          ))}
          <button className="rounded-lg border border-slate-700 px-3 py-2" onClick={resetRecipe}>
            Reset
          </button>
        </div>
      </div>
    </section>
  );
};

export default RecipePanel;
