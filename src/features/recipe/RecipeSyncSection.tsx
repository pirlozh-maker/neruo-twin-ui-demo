import Accordion from "../../components/Accordion";
import Slider from "../../components/Slider";
import type { Recipe } from "../../types";

type Props = {
  recipe: Recipe;
  updateRecipe: (next: Recipe) => void;
};

const RecipeSyncSection = ({ recipe, updateRecipe }: Props) => (
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
);

export default RecipeSyncSection;
