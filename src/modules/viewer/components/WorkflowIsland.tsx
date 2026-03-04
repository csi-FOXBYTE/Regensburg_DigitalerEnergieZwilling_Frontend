import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/react";
import { parseAsInteger, useQueryState } from "nuqs";
import { useEffect, useState } from "react";

import { BuildingDialogs } from "./BuildingDialogs";
import { SimulationScenarios } from "./SimulationScenarios";
import { ResultsReview } from "./ResultsReview";
import { DecisionSupport } from "./DecisionSupport";
import { ProgressBar } from "./ProgressBar";
import {
  type BuildingData,
  type RenovationMeasures,
  type SimulationResults,
  STEP,
} from "../types";
import { setViewerStep } from "../state/selectionStore";
import "../styles/globals.css";

const client = new QueryClient({ defaultOptions: { queries: {} } });

function Workflow() {
  const [currentStep, setCurrentStep] = useQueryState<STEP>(
    "s",
    parseAsInteger.withDefault(STEP.building)
  );
  const [buildingData, setBuildingData] = useState<BuildingData | null>(null);
  const [measures, setMeasures] = useState<RenovationMeasures>({
    roof: null,
    facade: null,
    windows: null,
    basement: null,
    photovoltaic: null,
    geothermal: null,
    storage: false,
  });
  const [results, setResults] = useState<SimulationResults | null>(null);

  useEffect(() => {
    setViewerStep(currentStep);
  }, [currentStep]);

  useEffect(() => {
    if (currentStep !== STEP.building && !buildingData) {
      setCurrentStep(STEP.building);
    }
  }, [buildingData, currentStep, setCurrentStep]);

  const handleBuildingSelect = (data: BuildingData) => {
    setBuildingData(data);
    setCurrentStep(STEP.simulation);
  };

  const handleMeasuresChange = (
    newMeasures: RenovationMeasures,
    calculatedResults: SimulationResults
  ) => {
    setMeasures(newMeasures);
    setResults(calculatedResults);
  };

  const handleViewResults = () => {
    setCurrentStep(STEP.results);
  };

  const handleViewDecision = () => {
    setCurrentStep(STEP.decision);
  };

  const handleBack = () => {
    const steps: STEP[] = [
      STEP.building,
      STEP.simulation,
      STEP.results,
      STEP.decision,
    ];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case STEP.building:
        return <BuildingDialogs onBuildingSelect={handleBuildingSelect} />;
      case STEP.simulation:
        return (
          <SimulationScenarios
            buildingData={buildingData!}
            measures={measures}
            onMeasuresChange={handleMeasuresChange}
            onViewResults={handleViewResults}
            onBack={handleBack}
          />
        );
      case STEP.results:
        return (
          <ResultsReview
            buildingData={buildingData!}
            measures={measures}
            results={results!}
            onViewDecision={handleViewDecision}
            onBack={handleBack}
          />
        );
      case STEP.decision:
        return (
          <DecisionSupport
            buildingData={buildingData!}
            measures={measures}
            results={results!}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  const isBuildingStep = currentStep === STEP.building;

  return (
    <div className="min-h-screen bg-transparent relative z-10 pointer-events-none">
      <div className="fixed top-0 inset-x-0 z-30 pointer-events-auto">
        <ProgressBar currentStep={currentStep} onBack={handleBack} />
      </div>
      <main className={isBuildingStep ? "pt-0" : "pt-20"}>
        {currentStep !== STEP.building && (
          <div className="fixed inset-0 bg-white/45 backdrop-blur-[1px] pointer-events-none z-0" />
        )}
        <div className="relative z-10 pointer-events-auto">{renderStep()}</div>
      </main>
    </div>
  );
}

export default function WorkflowIsland() {
  return (
    <NuqsAdapter>
      <QueryClientProvider client={client}>
        <Workflow />
      </QueryClientProvider>
    </NuqsAdapter>
  );
}
