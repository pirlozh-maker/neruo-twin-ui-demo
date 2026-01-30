import Accordion from "../components/Accordion";
import Slider from "../components/Slider";
import Toggle from "../components/Toggle";
import { presets, CHANNELS_64 } from "../utils/recipes";
import type { ChangeEvent } from "react";
import { useAppStore } from "../state/store";
import type { Recipe } from "../types";
import { downloadJson } from "../utils/exporters";
import MacroDock from "./MacroDock";
import RecipeActions from "./recipe/RecipeActions";
import RecipeEegSection from "./recipe/RecipeEegSection";
import RecipeEmgSection from "./recipe/RecipeEmgSection";
import RecipeOutputSection from "./recipe/RecipeOutputSection";
import RecipePriorSection from "./recipe/RecipePriorSection";
import RecipeSyncSection from "./recipe/RecipeSyncSection";

const RecipePanel = () => {
  const { recipe, setRecipe, mode } = useAppStore();
  const isLab = mode === "lab";
  const updateRecipe = (next: Recipe) => setRecipe(next);

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
      <MacroDock />
      <RecipeEegSection recipe={recipe} updateRecipe={updateRecipe} />
      <RecipeEmgSection recipe={recipe} updateRecipe={updateRecipe} isLab={isLab} />
      <RecipeSyncSection recipe={recipe} updateRecipe={updateRecipe} />
      <RecipePriorSection recipe={recipe} updateRecipe={updateRecipe} />
      <RecipeOutputSection recipe={recipe} updateRecipe={updateRecipe} />
      <RecipeActions recipe={recipe} onLoad={handleFileLoad} />
    </section>
  );
};

export default RecipePanel;
