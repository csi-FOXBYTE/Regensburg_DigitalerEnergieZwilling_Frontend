import { useState, useEffect } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Info,
  Home,
  Sun,
  Leaf,
  Battery,
} from "lucide-react";
import {
  type BuildingData,
  type RenovationMeasures,
  type SimulationResults,
} from "../types";
import { calculateRenovationImpact } from "../utils/calculations";

interface SimulationScenariosProps {
  buildingData: BuildingData;
  measures: RenovationMeasures;
  onMeasuresChange: (
    measures: RenovationMeasures,
    results: SimulationResults
  ) => void;
  onViewResults: () => void;
  onBack: () => void;
}

export function SimulationScenarios({
  buildingData,
  measures,
  onMeasuresChange,
  onViewResults,
  onBack,
}: SimulationScenariosProps) {
  const [localMeasures, setLocalMeasures] =
    useState<RenovationMeasures>(measures);
  const [results, setResults] = useState<SimulationResults | null>(null);

  useEffect(() => {
    // Calculate results whenever measures change
    const newResults = calculateRenovationImpact(
      buildingData.currentEnergy.demand,
      buildingData.currentEnergy.annualCosts,
      buildingData.currentEnergy.co2Emissions,
      buildingData.geometry.area,
      localMeasures
    );
    setResults(newResults);
    onMeasuresChange(localMeasures, newResults);
  }, [localMeasures, buildingData]);

  const updateMeasure = <K extends keyof RenovationMeasures>(
    key: K,
    value: RenovationMeasures[K]
  ) => {
    setLocalMeasures({ ...localMeasures, [key]: value });
  };

  const hasAnyMeasures = Object.values(localMeasures).some(
    (v) => v !== null && v !== false
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h2 className="text-gray-900 mb-2">Sanierungssimulation</h2>
        <p className="text-gray-600">
          Wählen Sie Maßnahmen aus und sehen Sie die Auswirkungen in Echtzeit.
          Alle Maßnahmen sind kombinierbar.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Current State */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
            <h3 className="text-gray-900 mb-4">Aktueller Zustand</h3>

            <div className="space-y-4">
              <div>
                <p className="text-gray-600 mb-1">Adresse</p>
                <p className="text-gray-900">{buildingData.address}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 mb-1">Fläche</p>
                  <p className="text-gray-900">
                    {buildingData.geometry.area} m²
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Baujahr</p>
                  <p className="text-gray-900">
                    {buildingData.construction.yearBuilt}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Energiebedarf</span>
                    <span className="text-gray-900">
                      {buildingData.currentEnergy.demand} kWh/m²·a
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Effizienzklasse</span>
                    <span className="px-3 py-1 rounded bg-red-100 text-red-800">
                      {buildingData.currentEnergy.efficiencyClass}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Jährliche Kosten</span>
                    <span className="text-gray-900">
                      {buildingData.currentEnergy.annualCosts.toLocaleString(
                        "de-DE"
                      )}{" "}
                      €
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">CO₂-Emissionen</span>
                    <span className="text-gray-900">
                      {buildingData.currentEnergy.co2Emissions} kg/m²·a
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column - Measures */}
        <div className="lg:col-span-2 space-y-6">
          {/* Building Envelope Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-gray-900 mb-4 flex items-center">
              <Home className="w-5 h-5 mr-2 text-blue-600" />
              Gebäudehülle
            </h3>

            <div className="space-y-4">
              {[
                { key: "roof" as const, label: "Dachdämmung", icon: "🏠" },
                {
                  key: "facade" as const,
                  label: "Fassadendämmung",
                  icon: "🧱",
                },
                { key: "windows" as const, label: "Fenstertausch", icon: "🪟" },
                {
                  key: "basement" as const,
                  label: "Kellerdeckendämmung",
                  icon: "⬇️",
                },
              ].map((item) => (
                <div key={item.key}>
                  <p className="text-gray-900 mb-2">
                    {item.icon} {item.label}
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => updateMeasure(item.key, null)}
                      className={`flex-1 py-2 px-4 rounded-lg border transition-all ${
                        localMeasures[item.key] === null
                          ? "border-blue-600 bg-blue-50 text-blue-900"
                          : "border-gray-300 text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      Keine
                    </button>
                    <button
                      onClick={() => updateMeasure(item.key, "standard55")}
                      className={`flex-1 py-2 px-4 rounded-lg border transition-all ${
                        localMeasures[item.key] === "standard55"
                          ? "border-blue-600 bg-blue-50 text-blue-900"
                          : "border-gray-300 text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      Standard 55
                    </button>
                    <button
                      onClick={() => updateMeasure(item.key, "standard77")}
                      className={`flex-1 py-2 px-4 rounded-lg border transition-all ${
                        localMeasures[item.key] === "standard77"
                          ? "border-blue-600 bg-blue-50 text-blue-900"
                          : "border-gray-300 text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      Standard 77
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-900 flex items-start">
                <Info className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                Standard 55: Mindestanforderungen KfW 55 | Standard 77:
                Mindestanforderungen KfW 77
              </p>
            </div>
          </div>

          {/* Renewable Energy Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-gray-900 mb-4 flex items-center">
              <Leaf className="w-5 h-5 mr-2 text-green-600" />
              Erneuerbare Energien
            </h3>

            <div className="space-y-4">
              {/* Photovoltaic */}
              <div>
                <p className="text-gray-900 mb-2 flex items-center">
                  <Sun className="w-4 h-4 mr-2" />
                  Photovoltaik
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => updateMeasure("photovoltaic", null)}
                    className={`flex-1 py-2 px-4 rounded-lg border transition-all ${
                      localMeasures.photovoltaic === null
                        ? "border-green-600 bg-green-50 text-green-900"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    Keine
                  </button>
                  <button
                    onClick={() => updateMeasure("photovoltaic", "small")}
                    className={`flex-1 py-2 px-4 rounded-lg border transition-all ${
                      localMeasures.photovoltaic === "small"
                        ? "border-green-600 bg-green-50 text-green-900"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    Klein (5 kWp)
                  </button>
                  <button
                    onClick={() => updateMeasure("photovoltaic", "medium")}
                    className={`flex-1 py-2 px-4 rounded-lg border transition-all ${
                      localMeasures.photovoltaic === "medium"
                        ? "border-green-600 bg-green-50 text-green-900"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    Mittel (10 kWp)
                  </button>
                  <button
                    onClick={() => updateMeasure("photovoltaic", "large")}
                    className={`flex-1 py-2 px-4 rounded-lg border transition-all ${
                      localMeasures.photovoltaic === "large"
                        ? "border-green-600 bg-green-50 text-green-900"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    Groß (15 kWp)
                  </button>
                </div>
              </div>

              {/* Geothermal */}
              <div>
                <p className="text-gray-900 mb-2 flex items-center">
                  <Leaf className="w-4 h-4 mr-2" />
                  Geothermie / Wärmepumpe
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => updateMeasure("geothermal", null)}
                    className={`flex-1 py-2 px-4 rounded-lg border transition-all ${
                      localMeasures.geothermal === null
                        ? "border-green-600 bg-green-50 text-green-900"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    Keine
                  </button>
                  <button
                    onClick={() => updateMeasure("geothermal", "small")}
                    className={`flex-1 py-2 px-4 rounded-lg border transition-all ${
                      localMeasures.geothermal === "small"
                        ? "border-green-600 bg-green-50 text-green-900"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    Klein
                  </button>
                  <button
                    onClick={() => updateMeasure("geothermal", "medium")}
                    className={`flex-1 py-2 px-4 rounded-lg border transition-all ${
                      localMeasures.geothermal === "medium"
                        ? "border-green-600 bg-green-50 text-green-900"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    Mittel
                  </button>
                  <button
                    onClick={() => updateMeasure("geothermal", "large")}
                    className={`flex-1 py-2 px-4 rounded-lg border transition-all ${
                      localMeasures.geothermal === "large"
                        ? "border-green-600 bg-green-50 text-green-900"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    Groß
                  </button>
                </div>
              </div>

              {/* Storage */}
              <div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localMeasures.storage}
                    onChange={(e) => updateMeasure("storage", e.target.checked)}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <Battery className="w-4 h-4 ml-3 mr-2" />
                  <span className="text-gray-900">Stromspeicher (10 kWh)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Live Results Preview */}
          {results && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
              <h3 className="text-gray-900 mb-4">Vorschau: Neue Werte</h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-gray-600 mb-1">Energiebedarf</p>
                  <p className="text-gray-900">
                    {results.energyDemand} kWh/m²·a
                  </p>
                  <p className="text-green-600">
                    {Math.round(
                      ((buildingData.currentEnergy.demand -
                        results.energyDemand) /
                        buildingData.currentEnergy.demand) *
                        100
                    )}
                    % Reduktion
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <p className="text-gray-600 mb-1">Effizienzklasse</p>
                  <p className="px-3 py-1 rounded bg-green-100 text-green-800 inline-block">
                    {results.efficiencyClass}
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <p className="text-gray-600 mb-1">Jährl. Kosten</p>
                  <p className="text-gray-900">
                    {results.annualCosts.toLocaleString("de-DE")} €
                  </p>
                  <p className="text-green-600">
                    -{results.annualSavings.toLocaleString("de-DE")} €
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <p className="text-gray-600 mb-1">CO₂-Reduktion</p>
                  <p className="text-green-600">{results.co2Reduction}%</p>
                </div>
              </div>

              <button
                onClick={onViewResults}
                disabled={!hasAnyMeasures}
                className={`w-full mt-6 py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                  hasAnyMeasures
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <span>Detaillierte Ergebnisse anzeigen</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Transparency Note */}
          <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
            <h4 className="text-yellow-900 mb-2 flex items-center">
              <Info className="w-5 h-5 mr-2" />
              Transparenzhinweis
            </h4>
            <p className="text-yellow-800">
              Die Berechnungen basieren auf vereinfachten Annahmen nach DIN V
              18599, IWU-Typologien und pauschalen Werten. Für eine detaillierte
              Planung ist eine individuelle Energieberatung erforderlich.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
