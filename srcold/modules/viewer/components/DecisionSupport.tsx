import { useState } from 'react';
import { ArrowLeft, Download, Euro, Lightbulb, FileText, CheckCircle, Info } from 'lucide-react';
import { type BuildingData, type RenovationMeasures, type SimulationResults } from '../types';

interface DecisionSupportProps {
  buildingData: BuildingData;
  measures: RenovationMeasures;
  results: SimulationResults;
  onBack: () => void;
}

export function DecisionSupport({
  buildingData,
  measures,
  results,
  onBack,
}: DecisionSupportProps) {
  const [budget, setBudget] = useState<string>('50000');
  const [subsidyRate, setSubsidyRate] = useState<string>('20');

  const budgetAmount = parseInt(budget) || 0;
  const subsidyPercent = parseInt(subsidyRate) || 0;

  // Calculate with subsidies
  const avgInvestment = (results.investment.min + results.investment.max) / 2;
  const subsidyAmount = avgInvestment * (subsidyPercent / 100);
  const netInvestment = avgInvestment - subsidyAmount;
  const subsidizedPayback = results.annualSavings > 0 ? netInvestment / results.annualSavings : 999;

  // Get selected measures
  const selectedMeasures = [
    measures.roof && { name: `Dachdämmung (${measures.roof === 'standard77' ? 'Standard 77' : 'Standard 55'})`, type: 'envelope' },
    measures.facade && { name: `Fassadendämmung (${measures.facade === 'standard77' ? 'Standard 77' : 'Standard 55'})`, type: 'envelope' },
    measures.windows && { name: `Fenstertausch (${measures.windows === 'standard77' ? 'Standard 77' : 'Standard 55'})`, type: 'envelope' },
    measures.basement && { name: `Kellerdeckendämmung (${measures.basement === 'standard77' ? 'Standard 77' : 'Standard 55'})`, type: 'envelope' },
    measures.photovoltaic && { name: `Photovoltaik (${measures.photovoltaic})`, type: 'renewable' },
    measures.geothermal && { name: `Geothermie/Wärmepumpe (${measures.geothermal})`, type: 'renewable' },
    measures.storage && { name: 'Stromspeicher', type: 'renewable' },
  ].filter(Boolean);

  // Budget-based recommendation
  const getBudgetRecommendation = () => {
    if (budgetAmount >= avgInvestment) {
      return {
        recommendation: 'Alle gewählten Maßnahmen sind im Budget',
        priority: 'high',
      };
    } else if (budgetAmount >= avgInvestment * 0.7) {
      return {
        recommendation: 'Fokus auf Gebäudehülle, erneuerbare Energien später',
        priority: 'medium',
      };
    } else {
      return {
        recommendation: 'Schrittweise Sanierung empfohlen – Start mit Fenstern und Dach',
        priority: 'low',
      };
    }
  };

  const budgetRec = getBudgetRecommendation();

  const handleDownloadPDF = () => {
    // In a real application, this would generate a proper PDF
    alert('PDF-Export wird generiert...\n\nDieser Bericht enthält:\n- Ihre Gebäudedaten\n- Gewählte Maßnahmen\n- Berechnete Ergebnisse\n- Wirtschaftlichkeitsanalyse\n- Nächste Schritte\n\nBitte nutzen Sie diesen Bericht als Grundlage für eine professionelle Energieberatung.');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h2 className="text-gray-900 mb-2">Entscheidungsunterstützung</h2>
        <p className="text-gray-600">
          Planen Sie Ihre Sanierung mit Förderungen und budgetbasierten Empfehlungen.
        </p>
      </div>

      {/* Economic Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Investment & Subsidies */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-6 flex items-center">
            <Euro className="w-5 h-5 mr-2 text-blue-600" />
            Wirtschaftlichkeit mit Förderung
          </h3>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-gray-900 mb-2">
                Fördersatz (%)
              </label>
              <input
                type="range"
                min="0"
                max="45"
                step="5"
                value={subsidyRate}
                onChange={(e) => setSubsidyRate(e.target.value)}
                className="w-full"
              />
              <div className="flex justify-between text-gray-600 mt-1">
                <span>0%</span>
                <span className="text-blue-600">{subsidyRate}%</span>
                <span>45%</span>
              </div>
              <p className="text-gray-500 mt-2 flex items-start">
                <Info className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                KfW-Förderung liegt typischerweise zwischen 20-45% je nach Programm
              </p>
            </div>
          </div>

          <div className="space-y-3 bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex justify-between">
              <span className="text-gray-600">Brutto-Investition:</span>
              <span className="text-gray-900">{avgInvestment.toLocaleString('de-DE')} €</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Förderung ({subsidyPercent}%):</span>
              <span>- {subsidyAmount.toLocaleString('de-DE')} €</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-blue-300">
              <span className="text-gray-900">Netto-Investition:</span>
              <span className="text-gray-900">{netInvestment.toLocaleString('de-DE')} €</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="p-3 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-600 mb-1">Amortisation</p>
              <p className="text-gray-900">
                {subsidizedPayback < 50 ? `${Math.round(subsidizedPayback)} Jahre` : '> 50 Jahre'}
              </p>
              <p className="text-gray-500">Mit Förderung</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-600 mb-1">Einsparung</p>
              <p className="text-green-600">{results.annualSavings.toLocaleString('de-DE')} €</p>
              <p className="text-gray-500">Pro Jahr</p>
            </div>
          </div>
        </div>

        {/* Budget Planning */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-6 flex items-center">
            <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
            Budgetbasierte Empfehlung
          </h3>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-gray-900 mb-2">
                Verfügbares Budget (€)
              </label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                step="5000"
                min="0"
              />
            </div>
          </div>

          <div className={`p-4 rounded-lg border-2 mb-4 ${
            budgetRec.priority === 'high' ? 'bg-green-50 border-green-200' :
            budgetRec.priority === 'medium' ? 'bg-yellow-50 border-yellow-200' :
            'bg-orange-50 border-orange-200'
          }`}>
            <p className={`mb-2 ${
              budgetRec.priority === 'high' ? 'text-green-900' :
              budgetRec.priority === 'medium' ? 'text-yellow-900' :
              'text-orange-900'
            }`}>
              <CheckCircle className="w-5 h-5 inline mr-2" />
              Empfehlung
            </p>
            <p className={
              budgetRec.priority === 'high' ? 'text-green-800' :
              budgetRec.priority === 'medium' ? 'text-yellow-800' :
              'text-orange-800'
            }>
              {budgetRec.recommendation}
            </p>
          </div>

          {budgetAmount < avgInvestment && (
            <div className="space-y-2">
              <p className="text-gray-900 mb-2">Priorisierte Maßnahmen:</p>
              <ol className="space-y-2">
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2">1</span>
                  <span className="text-gray-700">Fenstertausch (schnelle Wirkung, moderater Preis)</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2">2</span>
                  <span className="text-gray-700">Dachdämmung (hohe Wirkung bei Satteldach)</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2">3</span>
                  <span className="text-gray-700">Fassadendämmung (größte Fläche, hohe Wirkung)</span>
                </li>
              </ol>
            </div>
          )}
        </div>
      </div>

      {/* Selected Measures Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h3 className="text-gray-900 mb-4">Gewählte Maßnahmen</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selectedMeasures.length > 0 ? (
            selectedMeasures.map((measure, index) => (
              <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <CheckCircle className={`w-5 h-5 mr-3 ${
                  measure?.type === 'envelope' ? 'text-blue-600' : 'text-green-600'
                }`} />
                <span className="text-gray-900">{measure?.name}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-2">Keine Maßnahmen ausgewählt</p>
          )}
        </div>
      </div>

      {/* Key Results Summary */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6 mb-8">
        <h3 className="text-gray-900 mb-4">Zusammenfassung der Ergebnisse</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-gray-600 mb-1">Energieklasse</p>
            <div className="flex items-center justify-center space-x-2">
              <span className="px-2 py-1 rounded bg-red-100 text-red-800">
                {buildingData.currentEnergy.efficiencyClass}
              </span>
              <span className="text-blue-600">→</span>
              <span className="px-2 py-1 rounded bg-green-100 text-green-800">
                {results.efficiencyClass}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-gray-600 mb-1">Energie-Reduktion</p>
            <p className="text-green-600">
              -{Math.round(((buildingData.currentEnergy.demand - results.energyDemand) / buildingData.currentEnergy.demand) * 100)}%
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-gray-600 mb-1">CO₂-Reduktion</p>
            <p className="text-green-600">-{results.co2Reduction}%</p>
          </div>

          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-gray-600 mb-1">Jährl. Ersparnis</p>
            <p className="text-green-600">{results.annualSavings.toLocaleString('de-DE')} €</p>
          </div>
        </div>
      </div>

      {/* Export & Next Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-600" />
            PDF-Bericht exportieren
          </h3>
          
          <p className="text-gray-600 mb-4">
            Laden Sie einen übersichtlichen Bericht mit allen Simulationsergebnissen herunter. 
            Dieser enthält:
          </p>

          <ul className="space-y-2 mb-6">
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">Ihre Gebäudedaten und gewählten Maßnahmen</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">Detaillierte Vorher/Nachher-Vergleiche</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">Wirtschaftlichkeitsberechnung mit Förderung</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">Einordnung im Stadtvergleich</span>
            </li>
          </ul>

          <button
            onClick={handleDownloadPDF}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>PDF-Bericht herunterladen</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-4">Nächste Schritte</h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-blue-900 mb-2">1. Energieberatung einholen</h4>
              <p className="text-blue-800">
                Nutzen Sie diesen Bericht als Grundlage für eine professionelle Energieberatung. 
                Diese wird oft gefördert (bis zu 80% der Kosten).
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-blue-900 mb-2">2. Förderung prüfen</h4>
              <p className="text-blue-800">
                Informieren Sie sich über KfW-Programme (z.B. KfW 261, KfW 262) und 
                BAFA-Förderungen für Einzelmaßnahmen.
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-blue-900 mb-2">3. Angebote einholen</h4>
              <p className="text-blue-800">
                Holen Sie mehrere Angebote ein und vergleichen Sie diese. 
                Achten Sie auf Qualifikation und Referenzen der Handwerker.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Final Disclaimer */}
      <div className="mt-8 bg-yellow-50 rounded-lg border border-yellow-200 p-6">
        <h4 className="text-yellow-900 mb-2 flex items-center">
          <Info className="w-5 h-5 mr-2" />
          Wichtiger Hinweis
        </h4>
        <p className="text-yellow-800">
          Diese Simulation ersetzt keine professionelle Energieberatung. Die Werte basieren auf 
          vereinfachten Annahmen und dienen ausschließlich der Orientierung. Für konkrete 
          Planungen ist eine individuelle Beratung vor Ort unerlässlich.
        </p>
      </div>
    </div>
  );
}