import { ArrowRight, TrendingDown, Leaf, Euro, Zap } from 'lucide-react';
import { type BuildingData, type RenovationMeasures, type SimulationResults } from '../types';
import { getCityStatistics } from '../utils/calculations';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ResultsReviewProps {
  buildingData: BuildingData;
  measures: RenovationMeasures;
  results: SimulationResults;
  onViewDecision: () => void;
  onBack: () => void;
}

export function ResultsReview({
  buildingData,
  results,
  onViewDecision,
  onBack,
}: ResultsReviewProps) {
  const cityStats = getCityStatistics();

  // Prepare data for comparison chart
  const comparisonData = [
    {
      category: 'Energiebedarf',
      vorher: buildingData.currentEnergy.demand,
      nachher: results.energyDemand,
      unit: 'kWh/m²·a',
    },
    {
      category: 'Jährl. Kosten',
      vorher: buildingData.currentEnergy.annualCosts,
      nachher: results.annualCosts,
      unit: '€',
    },
    {
      category: 'CO₂-Emissionen',
      vorher: buildingData.currentEnergy.co2Emissions,
      nachher: results.co2Emissions,
      unit: 'kg/m²·a',
    },
  ];

  // Prepare city distribution chart
  const cityDistributionData = cityStats.distribution.map(item => ({
    ...item,
    highlight: item.class === buildingData.currentEnergy.efficiencyClass || item.class === results.efficiencyClass,
  }));

  // Calculate percentile position
  const currentPercentile = cityStats.distribution
    .slice(cityStats.distribution.findIndex(d => d.class === buildingData.currentEnergy.efficiencyClass))
    .reduce((sum, d) => sum + d.percentage, 0);

  const newPercentile = cityStats.distribution
    .slice(cityStats.distribution.findIndex(d => d.class === results.efficiencyClass))
    .reduce((sum, d) => sum + d.percentage, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h2 className="text-gray-900 mb-2">Ergebnisse & Einordnung</h2>
        <p className="text-gray-600">
          Ihre simulierten Sanierungsmaßnahmen im Vergleich – zum aktuellen Zustand und zum Regensburger Gebäudebestand.
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <Zap className="w-8 h-8 text-blue-600" />
            <TrendingDown className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-gray-600 mb-1">Energiebedarf</p>
          <div className="flex items-baseline space-x-2">
            <span className="text-gray-400 line-through">{buildingData.currentEnergy.demand}</span>
            <span className="text-blue-600">→</span>
            <span className="text-gray-900">{results.energyDemand}</span>
          </div>
          <p className="text-gray-500">kWh/m²·a</p>
          <div className="mt-2 px-2 py-1 bg-green-100 text-green-800 rounded inline-block">
            -{Math.round(((buildingData.currentEnergy.demand - results.energyDemand) / buildingData.currentEnergy.demand) * 100)}%
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="px-3 py-1 rounded bg-red-100 text-red-800">
              {buildingData.currentEnergy.efficiencyClass}
            </div>
            <ArrowRight className="w-5 h-5 text-blue-600" />
            <div className="px-3 py-1 rounded bg-green-100 text-green-800">
              {results.efficiencyClass}
            </div>
          </div>
          <p className="text-gray-600 mb-1">Effizienzklasse</p>
          <p className="text-gray-900">
            Verbesserung um {Math.abs(
              ['H', 'G', 'F', 'E', 'D', 'C', 'B', 'A', 'A+'].indexOf(results.efficiencyClass) -
              ['H', 'G', 'F', 'E', 'D', 'C', 'B', 'A', 'A+'].indexOf(buildingData.currentEnergy.efficiencyClass)
            )} Klasse(n)
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <Euro className="w-8 h-8 text-green-600" />
            <TrendingDown className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-gray-600 mb-1">Jährliche Kosten</p>
          <div className="flex items-baseline space-x-2">
            <span className="text-gray-400 line-through">
              {buildingData.currentEnergy.annualCosts.toLocaleString('de-DE')}
            </span>
            <span className="text-blue-600">→</span>
            <span className="text-gray-900">{results.annualCosts.toLocaleString('de-DE')}</span>
          </div>
          <p className="text-gray-500">Euro pro Jahr</p>
          <div className="mt-2 px-2 py-1 bg-green-100 text-green-800 rounded inline-block">
            -{results.annualSavings.toLocaleString('de-DE')} €/Jahr
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <Leaf className="w-8 h-8 text-green-600" />
            <TrendingDown className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-gray-600 mb-1">CO₂-Emissionen</p>
          <div className="flex items-baseline space-x-2">
            <span className="text-gray-400 line-through">{buildingData.currentEnergy.co2Emissions}</span>
            <span className="text-blue-600">→</span>
            <span className="text-gray-900">{results.co2Emissions}</span>
          </div>
          <p className="text-gray-500">kg/m²·a</p>
          <div className="mt-2 px-2 py-1 bg-green-100 text-green-800 rounded inline-block">
            -{results.co2Reduction}%
          </div>
        </div>
      </div>

      {/* Vorher/Nachher Comparison Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h3 className="text-gray-900 mb-6">Vorher / Nachher Vergleich</h3>
        
        <div className="space-y-6">
          {comparisonData.map((item) => (
            <div key={item.category}>
              <p className="text-gray-900 mb-2">{item.category}</p>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-600">Vorher</span>
                    <span className="text-gray-900">{item.vorher.toLocaleString('de-DE')} {item.unit}</span>
                  </div>
                  <div className="h-8 bg-red-100 rounded relative overflow-hidden">
                    <div
                      className="h-full bg-red-500"
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-600">Nachher</span>
                    <span className="text-gray-900">{item.nachher.toLocaleString('de-DE')} {item.unit}</span>
                  </div>
                  <div className="h-8 bg-green-100 rounded relative overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${(item.nachher / item.vorher) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* City Comparison */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h3 className="text-gray-900 mb-4">Vergleich mit Regensburger Gebäudebestand</h3>
        
        <div className="mb-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cityDistributionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="class" />
              <YAxis label={{ value: 'Anzahl Gebäude', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {cityDistributionData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.class === buildingData.currentEnergy.efficiencyClass
                        ? '#ef4444'
                        : entry.class === results.efficiencyClass
                        ? '#10b981'
                        : '#94a3b8'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-red-900">Aktueller Zustand</span>
              <span className="px-3 py-1 rounded bg-red-100 text-red-800">
                {buildingData.currentEnergy.efficiencyClass}
              </span>
            </div>
            <p className="text-red-800">
              Ihr Gebäude liegt im {currentPercentile > 50 ? 'unteren' : 'oberen'} Bereich 
              des Regensburger Bestands (ca. {Math.round(currentPercentile)}. Perzentil).
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-900">Nach Sanierung</span>
              <span className="px-3 py-1 rounded bg-green-100 text-green-800">
                {results.efficiencyClass}
              </span>
            </div>
            <p className="text-green-800">
              Mit den gewählten Maßnahmen würde Ihr Gebäude im {newPercentile > 50 ? 'unteren' : 'oberen'} Bereich 
              liegen (ca. {Math.round(newPercentile)}. Perzentil).
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-blue-900">
            ℹ️ Der Durchschnitt in Regensburg liegt bei {cityStats.average.energyDemand} kWh/m²·a 
            (Effizienzklasse {cityStats.average.efficiencyClass})
          </p>
        </div>
      </div>

      {/* Investment Overview */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6 mb-8">
        <h3 className="text-gray-900 mb-4">Investitionsübersicht</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-4">
            <p className="text-gray-600 mb-1">Geschätzte Investition</p>
            <p className="text-gray-900">
              {results.investment.min.toLocaleString('de-DE')} - {results.investment.max.toLocaleString('de-DE')} €
            </p>
            <p className="text-gray-500">Bandbreite je nach Ausführung</p>
          </div>

          <div className="bg-white rounded-lg p-4">
            <p className="text-gray-600 mb-1">Jährliche Einsparung</p>
            <p className="text-green-600">
              {results.annualSavings.toLocaleString('de-DE')} €
            </p>
            <p className="text-gray-500">Bei heutigen Energiepreisen</p>
          </div>

          <div className="bg-white rounded-lg p-4">
            <p className="text-gray-600 mb-1">Amortisation</p>
            <p className="text-gray-900">
              {results.paybackYears < 50 ? `ca. ${results.paybackYears} Jahre` : '> 50 Jahre'}
            </p>
            <p className="text-gray-500">Ohne Förderung</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={onViewDecision}
          className="flex-1 bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <span>Zur Entscheidungsunterstützung</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}