import Accordion from "../../components/Accordion";
import Slider from "../../components/Slider";
import Toggle from "../../components/Toggle";
import type { Recipe } from "../../types";

type Props = {
  recipe: Recipe;
  updateRecipe: (next: Recipe) => void;
  isLab: boolean;
};

const RecipeEmgSection = ({ recipe, updateRecipe, isLab }: Props) => {
  const handleEmgGain = (index: number, value: number) => {
    const gain = recipe.emg.gain.map((item, i) => (i === index ? value : item));
    updateRecipe({ ...recipe, emg: { ...recipe.emg, gain } });
  };

  return (
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
  );
};

export default RecipeEmgSection;
