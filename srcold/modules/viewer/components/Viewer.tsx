import { useState } from "react";
import { BuildingSelection } from "../../../../src/feature/map/BuildingSelection";
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
import { useQueryState, parseAsInteger } from "nuqs";
import "../styles/globals.css";

export default function Viewer() {
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
        return (
          <BuildingSelection
            onBuildingSelect={handleBuildingSelect}
            onBack={handleBack}
          />
        );
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

  return (
    <div className="min-h-screen bg-gray-50">
      <ProgressBar currentStep={currentStep} onBack={handleBack} />
      <main>{renderStep()}</main>
    </div>
  );
}
