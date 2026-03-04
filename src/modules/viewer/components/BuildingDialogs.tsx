import { useMemo, useState } from "react";
import {
  MapPin,
  Home,
  Calendar,
  Zap,
  Users,
  ArrowRight,
  HelpCircle,
  Database,
  TrendingUp,
  TrendingDown,
  Euro,
  Leaf,
  X,
} from "lucide-react";

import { type BuildingData } from "../types";
import { calculateInitialEnergy } from "../utils/calculations";
import { getSelectableBuildingById } from "../data/buildings";
import {
  useSelectedBuildingId,
  setSelectedBuildingId,
} from "../state/selectionStore";

interface BuildingDialogsProps {
  onBuildingSelect: (data: BuildingData) => void;
}

export function BuildingDialogs({ onBuildingSelect }: BuildingDialogsProps) {
  const [selectedBuildingId] = useSelectedBuildingId();
  const selectedBuilding = useMemo(
    () => getSelectableBuildingById(selectedBuildingId),
    [selectedBuildingId]
  );

  const [yearBuilt, setYearBuilt] = useState<string>("1960");
  const [heatingSystem, setHeatingSystem] = useState<string>("gas");
  const [residents, setResidents] = useState<string>("2");
  const [renovations, setRenovations] = useState({
    roof: false,
    facade: false,
    windows: false,
    basement: false,
  });
  const [renovationYears, setRenovationYears] = useState({
    roof: "",
    facade: "",
    windows: "",
    basement: "",
  });

  const liveCalculation = useMemo(() => {
    if (!selectedBuilding) return null;

    return calculateInitialEnergy(
      selectedBuilding.geometry.area,
      parseInt(yearBuilt) || 1960,
      heatingSystem,
      renovations
    );
  }, [selectedBuilding, yearBuilt, heatingSystem, renovations]);

  const cityAverage = 135;

  const handleSubmit = () => {
    if (!selectedBuilding) return;

    const buildingData: BuildingData = {
      id: selectedBuilding.id,
      address: selectedBuilding.address,
      geometry: selectedBuilding.geometry,
      construction: {
        yearBuilt: parseInt(yearBuilt),
        renovations: {},
      },
      heating: {
        system: heatingSystem === "gas" ? "Gasheizung" : "Ölheizung",
        energySource: heatingSystem,
      },
      household: {
        residents: parseInt(residents),
      },
      currentEnergy: calculateInitialEnergy(
        selectedBuilding.geometry.area,
        parseInt(yearBuilt),
        heatingSystem,
        renovations
      ),
    };

    onBuildingSelect(buildingData);
  };

  return (
    <div className="fixed inset-0 z-20 pointer-events-none">
      {!selectedBuilding && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 pointer-events-auto bg-white/95 border border-gray-200 rounded-lg shadow-lg px-4 py-2">
          Gebäude in der Karte auswählen, um die Sanierungsdialoge zu starten.
        </div>
      )}

      {selectedBuilding && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[850px] max-h-[calc(100vh-120px)] overflow-y-auto bg-white rounded-lg shadow-2xl border border-gray-200 pointer-events-auto">
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-900 flex items-center">
                <Home className="w-5 h-5 mr-2 text-[#D9291C]" />
                Gebaeudeinformationen
              </h3>
              <button
                onClick={() => setSelectedBuildingId(null)}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                title="Schliessen"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {liveCalculation && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-[#D9291C]" />
                  <span className="text-sm font-medium text-gray-900">
                    Live-Auswertung
                  </span>
                  <span className="text-xs text-gray-500 ml-auto">
                    Aktualisiert automatisch
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 mb-3">
                  <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-600" />
                      <p className="text-xs text-gray-600">Energiebedarf</p>
                    </div>
                    <p className="text-xl font-medium text-gray-900">
                      {liveCalculation.demand}
                    </p>
                    <p className="text-xs text-gray-500">kWh/m2*a</p>
                  </div>

                  <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                      <p className="text-xs text-gray-600">Effizienzklasse</p>
                    </div>
                    <p className="text-xl font-medium text-gray-900">
                      {liveCalculation.efficiencyClass}
                    </p>
                    <p className="text-xs text-gray-500">nach GEG</p>
                  </div>

                  <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Euro className="w-3.5 h-3.5 text-blue-600" />
                      <p className="text-xs text-gray-600">Jaehrl. Kosten</p>
                    </div>
                    <p className="text-xl font-medium text-gray-900">
                      {liveCalculation.annualCosts.toLocaleString("de-DE")}
                    </p>
                    <p className="text-xs text-gray-500">EUR/Jahr</p>
                  </div>

                  <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Leaf className="w-3.5 h-3.5 text-green-700" />
                      <p className="text-xs text-gray-600">CO2-Emissionen</p>
                    </div>
                    <p className="text-xl font-medium text-gray-900">
                      {liveCalculation.co2Emissions.toLocaleString("de-DE")}
                    </p>
                    <p className="text-xs text-gray-500">kg CO2/m2*a</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-gray-700 font-medium">
                      Vergleich mit Regensburg O
                    </p>
                    {liveCalculation.demand < cityAverage ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                        <TrendingDown className="w-3 h-3" />
                        Besser
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-800 text-xs rounded-full font-medium">
                        <TrendingUp className="w-3 h-3" />
                        Schlechter
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            liveCalculation.demand < cityAverage
                              ? "bg-green-500"
                              : "bg-orange-500"
                          }`}
                          style={{
                            width: `${Math.min(
                              (liveCalculation.demand / 250) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 whitespace-nowrap font-medium">
                      {Math.abs(liveCalculation.demand - cityAverage).toFixed(0)}
                      {" "}kWh/m2*a
                      {liveCalculation.demand < cityAverage
                        ? " weniger"
                        : " mehr"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 text-blue-800 text-xs rounded-full border border-blue-200">
                    <Database className="w-3 h-3" />
                    LoD2-Daten
                  </span>
                </div>

                <div className="p-3 bg-gradient-to-br from-blue-50 to-gray-50 rounded-lg border-2 border-blue-200">
                  <p className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    {selectedBuilding.address}
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="bg-white rounded-md p-2 border border-blue-100">
                      <p className="text-xs text-gray-500 mb-0.5">Flaeche</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedBuilding.geometry.area} m2
                      </p>
                    </div>
                    <div className="bg-white rounded-md p-2 border border-blue-100">
                      <p className="text-xs text-gray-500 mb-0.5">Geschosse</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedBuilding.geometry.floors}
                      </p>
                    </div>
                    <div className="bg-white rounded-md p-2 border border-blue-100">
                      <p className="text-xs text-gray-500 mb-0.5">Hoehe</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedBuilding.geometry.height} m
                      </p>
                    </div>
                    <div className="bg-white rounded-md p-2 border border-blue-100">
                      <p className="text-xs text-gray-500 mb-0.5">Dachtyp</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedBuilding.geometry.roofType}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-900 mb-1.5 flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1.5" />
                    Baujahr
                  </label>
                  <input
                    type="number"
                    value={yearBuilt}
                    onChange={(e) => setYearBuilt(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D9291C] focus:border-[#D9291C]"
                    min="1800"
                    max="2024"
                  />
                  <p className="text-xs text-gray-500 mt-1 flex items-center">
                    <HelpCircle className="w-3 h-3 mr-1" />
                    Vom System abgeleitet, bitte anpassen
                  </p>
                </div>

                <div>
                  <label className="block text-sm text-gray-900 mb-1.5 flex items-center">
                    <Users className="w-3.5 h-3.5 mr-1.5" />
                    Personen im Haushalt
                  </label>
                  <input
                    type="number"
                    value={residents}
                    onChange={(e) => setResidents(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D9291C] focus:border-[#D9291C]"
                    min="1"
                    max="10"
                  />
                  <p className="text-xs text-gray-500 mt-1 flex items-center">
                    <HelpCircle className="w-3 h-3 mr-1" />
                    Vom System abgeleitet, bitte anpassen
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-900 mb-1.5 flex items-center">
                  <Zap className="w-3.5 h-3.5 mr-1.5" />
                  Heizsystem & Energietraeger
                </label>
                <select
                  value={heatingSystem}
                  onChange={(e) => setHeatingSystem(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D9291C] focus:border-[#D9291C]"
                >
                  <option value="gas">Gasheizung</option>
                  <option value="oil">Oelheizung</option>
                  <option value="electric">Elektroheizung</option>
                  <option value="district">Fernwaerme</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-900 mb-2">
                  Bekannte Sanierungen (optional)
                </label>
                <div className="space-y-3">
                  {[
                    { key: "roof", label: "Dach" },
                    { key: "facade", label: "Fassade" },
                    { key: "windows", label: "Fenster" },
                    { key: "basement", label: "Kellerdecke" },
                  ].map((item) => (
                    <div key={item.key} className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={renovations[item.key as keyof typeof renovations]}
                          onChange={(e) => {
                            setRenovations({
                              ...renovations,
                              [item.key]: e.target.checked,
                            });
                            if (!e.target.checked) {
                              setRenovationYears({
                                ...renovationYears,
                                [item.key]: "",
                              });
                            }
                          }}
                          className="w-4 h-4 text-[#D9291C] border-gray-300 rounded focus:ring-[#D9291C]"
                        />
                        <span className="ml-2 text-sm text-gray-900">
                          {item.label}
                        </span>
                      </label>

                      {renovations[item.key as keyof typeof renovations] && (
                        <div className="ml-6 pl-4 border-l-2 border-gray-200">
                          <label className="block text-xs text-gray-700 mb-1">
                            Sanierungsjahr
                          </label>
                          <input
                            type="number"
                            value={
                              renovationYears[
                                item.key as keyof typeof renovationYears
                              ]
                            }
                            onChange={(e) =>
                              setRenovationYears({
                                ...renovationYears,
                                [item.key]: e.target.value,
                              })
                            }
                            placeholder="z.B. 2015"
                            className="w-40 px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D9291C] focus:border-[#D9291C]"
                            min="1800"
                            max="2024"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-gray-200">
              <button
                onClick={handleSubmit}
                className="w-full bg-[#D9291C] text-white py-2.5 px-6 rounded-lg hover:bg-[#B8241A] transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!selectedBuilding}
              >
                <span>Zur Simulation</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
