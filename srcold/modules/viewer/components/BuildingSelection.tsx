import { useState, useMemo } from 'react';
import { MapPin, Home, Calendar, Zap, Users, ArrowRight, HelpCircle, Database, TrendingUp, TrendingDown, Euro, Leaf, X } from 'lucide-react';
import { type BuildingData } from '../../../srcold/modules/viewer/types';
import { calculateInitialEnergy } from '../../../srcold/modules/viewer/utils/calculations';
import { Map3D } from './Map3D';
import { ProgressBar } from '../../../srcold/modules/viewer/components/ProgressBar';

interface BuildingSelectionProps {
  onBuildingSelect: (data: BuildingData) => void;
  onBack: () => void;
}

// Mock building data for Regensburg with 3D coordinates
const mockBuildings = [
  {
    id: '1',
    address: 'Dachauplatz 12, 93047 Regensburg',
    coordinates: [12.0974, 49.0134] as [number, number],
    geometry: { area: 180, floors: 3, height: 9.5, roofType: 'Satteldach' },
    polygon: [[12.0974, 49.0134], [12.0975, 49.0134], [12.0975, 49.0135], [12.0974, 49.0135]] as [number, number][],
  },
  {
    id: '2',
    address: 'Arnulfsplatz 7, 93047 Regensburg',
    coordinates: [12.0984, 49.0144] as [number, number],
    geometry: { area: 240, floors: 4, height: 12, roofType: 'Flachdach' },
    polygon: [[12.0984, 49.0144], [12.0985, 49.0144], [12.0985, 49.0145], [12.0984, 49.0145]] as [number, number][],
  },
  {
    id: '3',
    address: 'Weingasse 3, 93047 Regensburg',
    coordinates: [12.0964, 49.0124] as [number, number],
    geometry: { area: 160, floors: 3, height: 9, roofType: 'Satteldach' },
    polygon: [[12.0964, 49.0124], [12.0965, 49.0124], [12.0965, 49.0125], [12.0964, 49.0125]] as [number, number][],
  },
];

export function BuildingSelection({ onBuildingSelect, onBack }: BuildingSelectionProps) {
  const [selectedBuilding, setSelectedBuilding] = useState<typeof mockBuildings[0] | null>(null);
  const [yearBuilt, setYearBuilt] = useState<string>('1960');
  const [heatingSystem, setHeatingSystem] = useState<string>('gas');
  const [residents, setResidents] = useState<string>('2');
  const [renovations, setRenovations] = useState({
    roof: false,
    facade: false,
    windows: false,
    basement: false,
  });
  const [renovationYears, setRenovationYears] = useState({
    roof: '',
    facade: '',
    windows: '',
    basement: '',
  });

  // Live calculation - updates whenever inputs change
  const liveCalculation = useMemo(() => {
    if (!selectedBuilding) return null;
    
    return calculateInitialEnergy(
      selectedBuilding.geometry.area,
      parseInt(yearBuilt) || 1960,
      heatingSystem,
      renovations
    );
  }, [selectedBuilding, yearBuilt, heatingSystem, renovations]);

  // City average for comparison
  const cityAverage = 135; // kWh/m²·a

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
        system: heatingSystem === 'gas' ? 'Gasheizung' : 'Ölheizung',
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
    <div className="fixed inset-0 flex flex-col">
      {/* Progress Bar with integrated back button */}
      <ProgressBar currentStep="building" onBack={onBack} />
      
      {/* Fullscreen Map */}
      <div className="flex-1 relative">
        <Map3D
          buildings={mockBuildings}
          selectedBuildingId={selectedBuilding?.id || null}
          onBuildingSelect={(building) => setSelectedBuilding(building)}
        />

        {/* Click-Outside Overlay */}
        {selectedBuilding && (
          <div 
            className="absolute inset-0 z-[5]"
            onClick={() => setSelectedBuilding(null)}
          />
        )}

        {/* Floating Side Panel */}
        {selectedBuilding && (
          <div 
            className="absolute top-4 left-1/2 -translate-x-1/2 w-[850px] max-h-[calc(100vh-120px)] overflow-y-auto bg-white rounded-lg shadow-2xl border border-gray-200 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-900 flex items-center">
                  <Home className="w-5 h-5 mr-2 text-[#D9291C]" />
                  Gebäudeinformationen
                </h3>
                <button
                  onClick={() => setSelectedBuilding(null)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Schließen"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Live-Auswertung Dashboard */}
              {liveCalculation && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-[#D9291C]" />
                    <span className="text-sm font-medium text-gray-900">Live-Auswertung</span>
                    <span className="text-xs text-gray-500 ml-auto">Aktualisiert automatisch</span>
                  </div>

                  {/* Horizontal Dashboard - 4 Metrics */}
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {/* Energy Demand */}
                    <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-600" />
                        <p className="text-xs text-gray-600">Energiebedarf</p>
                      </div>
                      <p className="text-xl font-medium text-gray-900">{liveCalculation.demand}</p>
                      <p className="text-xs text-gray-500">kWh/m²·a</p>
                    </div>

                    {/* Efficiency Class */}
                    <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                        <p className="text-xs text-gray-600">Effizienzklasse</p>
                      </div>
                      <p className="text-xl font-medium text-gray-900">{liveCalculation.efficiencyClass}</p>
                      <p className="text-xs text-gray-500">nach GEG</p>
                    </div>

                    {/* Annual Costs */}
                    <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Euro className="w-3.5 h-3.5 text-blue-600" />
                        <p className="text-xs text-gray-600">Jährl. Kosten</p>
                      </div>
                      <p className="text-xl font-medium text-gray-900">{liveCalculation.annualCosts.toLocaleString('de-DE')}</p>
                      <p className="text-xs text-gray-500">€/Jahr</p>
                    </div>

                    {/* CO2 Emissions */}
                    <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Leaf className="w-3.5 h-3.5 text-green-700" />
                        <p className="text-xs text-gray-600">CO₂-Emissionen</p>
                      </div>
                      <p className="text-xl font-medium text-gray-900">{liveCalculation.co2Emissions.toLocaleString('de-DE')}</p>
                      <p className="text-xs text-gray-500">kg CO₂/m²·a</p>
                    </div>
                  </div>

                  {/* Comparison with City Average */}
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-gray-700 font-medium">Vergleich mit Regensburg Ø</p>
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
                            className={`h-full transition-all ${liveCalculation.demand < cityAverage ? 'bg-green-500' : 'bg-orange-500'}`}
                            style={{ width: `${Math.min((liveCalculation.demand / 250) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 whitespace-nowrap font-medium">
                        {Math.abs(liveCalculation.demand - cityAverage).toFixed(0)} kWh/m²·a 
                        {liveCalculation.demand < cityAverage ? ' weniger' : ' mehr'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Single Column Layout for Building Data & Inputs */}
              <div className="space-y-4">
                {/* Selected Building Info */}
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
                        <p className="text-xs text-gray-500 mb-0.5">Fläche</p>
                        <p className="text-sm font-medium text-gray-900">{selectedBuilding.geometry.area} m²</p>
                      </div>
                      <div className="bg-white rounded-md p-2 border border-blue-100">
                        <p className="text-xs text-gray-500 mb-0.5">Geschosse</p>
                        <p className="text-sm font-medium text-gray-900">{selectedBuilding.geometry.floors}</p>
                      </div>
                      <div className="bg-white rounded-md p-2 border border-blue-100">
                        <p className="text-xs text-gray-500 mb-0.5">Höhe</p>
                        <p className="text-sm font-medium text-gray-900">{selectedBuilding.geometry.height} m</p>
                      </div>
                      <div className="bg-white rounded-md p-2 border border-blue-100">
                        <p className="text-xs text-gray-500 mb-0.5">Dachtyp</p>
                        <p className="text-sm font-medium text-gray-900">{selectedBuilding.geometry.roofType}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Input Fields in Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Year Built */}
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

                  {/* Residents */}
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

                {/* Heating System - Full Width */}
                <div>
                  <label className="block text-sm text-gray-900 mb-1.5 flex items-center">
                    <Zap className="w-3.5 h-3.5 mr-1.5" />
                    Heizsystem & Energieträger
                  </label>
                  <select
                    value={heatingSystem}
                    onChange={(e) => setHeatingSystem(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D9291C] focus:border-[#D9291C]"
                  >
                    <option value="gas">Gasheizung</option>
                    <option value="oil">Ölheizung</option>
                    <option value="electric">Elektroheizung</option>
                    <option value="district">Fernwärme</option>
                  </select>
                </div>

                {/* Known Renovations */}
                <div>
                  <label className="block text-sm text-gray-900 mb-2">
                    Bekannte Sanierungen (optional)
                  </label>
                  <div className="space-y-3">
                    {[
                      { key: 'roof', label: 'Dach' },
                      { key: 'facade', label: 'Fassade' },
                      { key: 'windows', label: 'Fenster' },
                      { key: 'basement', label: 'Kellerdecke' },
                    ].map((item) => (
                      <div key={item.key} className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={renovations[item.key as keyof typeof renovations]}
                            onChange={(e) => {
                              setRenovations({ ...renovations, [item.key]: e.target.checked });
                              if (!e.target.checked) {
                                setRenovationYears({ ...renovationYears, [item.key]: '' });
                              }
                            }}
                            className="w-4 h-4 text-[#D9291C] border-gray-300 rounded focus:ring-[#D9291C]"
                          />
                          <span className="ml-2 text-sm text-gray-900">{item.label}</span>
                        </label>
                        
                        {/* Renovation Year Input - appears when checkbox is checked */}
                        {renovations[item.key as keyof typeof renovations] && (
                          <div className="ml-6 pl-4 border-l-2 border-gray-200">
                            <label className="block text-xs text-gray-700 mb-1">
                              Sanierungsjahr
                            </label>
                            <input
                              type="number"
                              value={renovationYears[item.key as keyof typeof renovationYears]}
                              onChange={(e) => setRenovationYears({ ...renovationYears, [item.key]: e.target.value })}
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

              {/* Full Width Button at Bottom */}
              <div className="mt-5 pt-4 border-t border-gray-200">
                <button
                  onClick={handleSubmit}
                  className="w-full bg-[#D9291C] text-white py-2.5 px-6 rounded-lg hover:bg-[#B8241A] transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Zur Simulation</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}