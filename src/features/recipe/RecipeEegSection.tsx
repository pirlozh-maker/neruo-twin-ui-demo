import Accordion from "../../components/Accordion";
import Slider from "../../components/Slider";
import { CHANNELS_64 } from "../../utils/recipes";
import type { Recipe } from "../../types";

type Props = {
  recipe: Recipe;
  updateRecipe: (next: Recipe) => void;
};

const RecipeEegSection = ({ recipe, updateRecipe }: Props) => {
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

  return (
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
  );
};

export default RecipeEegSection;
