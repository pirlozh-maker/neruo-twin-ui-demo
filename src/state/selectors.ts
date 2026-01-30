import { useMemo } from "react";
import { useAppStore } from "./store";

export const useActiveRunResult = () => {
  const { activePage, runResult, scenarioResults, activeScenarioVariantId } = useAppStore();

  return useMemo(() => {
    if (activePage === "scenario" && activeScenarioVariantId) {
      return (
        scenarioResults.find((item) => item.variantId === activeScenarioVariantId)?.runResult ||
        null
      );
    }
    return runResult;
  }, [activeScenarioVariantId, activePage, runResult, scenarioResults]);
};
