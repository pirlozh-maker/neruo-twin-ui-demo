import { useMemo } from "react";
import { useAppStore } from "./store";

export const useActiveRunResult = () => {
  const { activeTab, runResult, scenarioResults, activeScenarioVariantId } = useAppStore();

  return useMemo(() => {
    if (activeTab === "scenario" && activeScenarioVariantId) {
      return (
        scenarioResults.find((item) => item.variantId === activeScenarioVariantId)?.runResult ||
        null
      );
    }
    return runResult;
  }, [activeScenarioVariantId, activeTab, runResult, scenarioResults]);
};
