import Accordion from "../../components/Accordion";
import type { Recipe } from "../../types";
import { useAppStore } from "../../state/store";

type Props = {
  recipe: Recipe;
  updateRecipe: (next: Recipe) => void;
};

const RecipeOutputSection = ({ recipe, updateRecipe }: Props) => {
  const pushToast = useAppStore((state) => state.pushToast);

  return (
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
            onClick={() => {
              updateRecipe({
                ...recipe,
                output: { ...recipe.output, quality: value },
              });
              pushToast({
                id: `toast_output_${Date.now()}`,
                title: "Output quality set",
                description: `Quality set to ${value}.`,
                tone: "info",
              });
            }}
          >
            {value}
          </button>
        ))}
      </div>
    </Accordion>
  );
};

export default RecipeOutputSection;
