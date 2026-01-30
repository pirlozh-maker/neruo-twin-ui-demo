import Accordion from "../../components/Accordion";
import Slider from "../../components/Slider";
import type { Recipe } from "../../types";

type Props = {
  recipe: Recipe;
  updateRecipe: (next: Recipe) => void;
};

const RecipePriorSection = ({ recipe, updateRecipe }: Props) => (
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
);

export default RecipePriorSection;
