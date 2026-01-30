import type { ChangeEvent } from "react";
import type { Recipe } from "../../types";
import { presets } from "../../utils/recipes";
import { downloadJson } from "../../utils/exporters";
import { useAppStore } from "../../state/store";

type Props = {
  recipe: Recipe;
  onLoad: (event: ChangeEvent<HTMLInputElement>) => void;
};

const RecipeActions = ({ recipe, onLoad }: Props) => {
  const { setRecipe, resetRecipe } = useAppStore();

  return (
    <div className="space-y-2 text-xs">
      <div className="flex flex-wrap gap-2">
        <label className="cursor-pointer rounded-lg border border-dashed border-slate-600 px-3 py-2">
          Load Recipe JSON
          <input type="file" className="hidden" onChange={onLoad} />
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
  );
};

export default RecipeActions;
