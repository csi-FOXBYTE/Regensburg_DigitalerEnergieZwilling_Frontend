import { Building2, ArrowRight, Info, Shield, FileText, Check, X } from 'lucide-react';
import { useState } from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [showPrivacyDialog, setShowPrivacyDialog] = useState(false);
  const [dataConsent, setDataConsent] = useState<boolean | null>(null);

  const handleStart = () => {
    if (dataConsent === null) {
      // User hasn't made a choice yet - show prompt
      setShowPrivacyDialog(true);
    } else {
      onStart();
    }
  };

  const handleConsent = (consent: boolean) => {
    setDataConsent(consent);
    setShowPrivacyDialog(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#D9291C] rounded-full mb-6">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-gray-900 mb-4">
            Digitale Sanierungssimulation Regensburg
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Dieses Tool zeigt Ihnen, wie sich energetische Sanierungen auf Energiebedarf, Kosten und CO₂ auswirken können – auf Basis verfügbarer Daten und Ihrer Angaben.
          </p>
        </div>

        {/* How it works - Outside the box */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-[#D9291C] rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-semibold">1</span>
            </div>
            <h4 className="text-gray-900 mb-2">Gebäude auswählen</h4>
            <p className="text-gray-600 text-sm">
              Wählen Sie Ihr Gebäude auf der Karte aus
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-[#D9291C] rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-semibold">2</span>
            </div>
            <h4 className="text-gray-900 mb-2">Maßnahmen simulieren</h4>
            <p className="text-gray-600 text-sm">
              Kombinieren Sie verschiedene Sanierungsoptionen
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-[#D9291C] rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-semibold">3</span>
            </div>
            <h4 className="text-gray-900 mb-2">Ergebnisse erhalten</h4>
            <p className="text-gray-600 text-sm">
              Vergleichen und als PDF exportieren
            </p>
          </div>
        </div>

        {/* Hinweis Box - Contains only notices */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-start space-x-4 mb-6">
            <div className="flex-shrink-0">
              <Info className="w-6 h-6 text-[#D9291C]" />
            </div>
            <div>
              <h3 className="text-gray-900 mb-2">Wichtiger Hinweis</h3>
              <p className="text-gray-600">
                Die Ergebnisse sind keine Energieberatung, sondern eine simulationsbasierte Orientierung. 
                Alle Berechnungen basieren auf vereinfachten Annahmen und öffentlich verfügbaren Daten.
              </p>
            </div>
          </div>

          {/* DSGVO Hinweis */}
          <div className="p-4 bg-gray-50 border-2 border-gray-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-gray-700 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-gray-900 mb-2 flex items-center gap-2">
                  Datenschutz & Datennutzung
                </h4>
                <p className="text-sm text-gray-700 mb-3">
                  Bitte lesen Sie unsere Datenschutzerklärung und entscheiden Sie, wie Ihre Daten verarbeitet werden sollen.
                </p>
                <button
                  onClick={() => setShowPrivacyDialog(true)}
                  className="inline-flex items-center gap-2 text-sm text-[#D9291C] hover:text-[#B8241A] underline"
                >
                  <FileText className="w-4 h-4" />
                  Datenschutzerklärung öffnen und lesen
                </button>

                {/* Consent Status */}
                {dataConsent !== null && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    {dataConsent ? (
                      <div className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-900 font-medium">Datenspeicherung zugestimmt</p>
                          <p className="text-xs text-gray-600 mt-1">
                            Ihre eingegebenen Daten werden von der Stadt Regensburg gespeichert und für städtische Projekte wie Wärmeplanung und Smart City Initiativen genutzt.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-900 font-medium">Datenspeicherung abgelehnt</p>
                          <p className="text-xs text-gray-600 mt-1">
                            Die Nutzung erfolgt anonym. Ihre Daten werden nicht gespeichert.
                          </p>
                        </div>
                      </div>
                    )}
                    <button
                      onClick={() => setShowPrivacyDialog(true)}
                      className="text-xs text-gray-500 hover:text-gray-700 underline mt-2"
                    >
                      Einstellung ändern
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Button - Outside the box */}
        <button
          onClick={handleStart}
          className="w-full bg-[#D9291C] text-white py-4 px-6 rounded-lg hover:bg-[#B8241A] transition-colors flex items-center justify-center space-x-2"
        >
          <span>Gebäude auswählen</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Privacy Dialog */}
      {showPrivacyDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-gray-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#D9291C]" />
                Datenschutzerklärung
              </h3>
              <button
                onClick={() => setShowPrivacyDialog(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-4 overflow-y-auto flex-1">
              <div className="space-y-4 text-sm text-gray-700">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">1. Zweck der Datenverarbeitung</h4>
                  <p>
                    Die Stadt Regensburg stellt diese Webanwendung zur energetischen Sanierungssimulation bereit, 
                    um Bürgerinnen und Bürgern eine Orientierungshilfe für mögliche Sanierungsmaßnahmen zu bieten.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">2. Datennutzung bei Zustimmung</h4>
                  <p className="mb-2">
                    Wenn Sie der Datenspeicherung zustimmen, werden die von Ihnen eingegebenen Daten (Gebäudedaten, 
                    gewählte Sanierungsmaßnahmen, etc.) von der Stadt Regensburg gespeichert und können für folgende Zwecke verwendet werden:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Kommunale Wärmeplanung und Energiekonzepte</li>
                    <li>Smart City Initiativen und Digitalisierungsprojekte</li>
                    <li>Statistische Auswertungen zur Gebäudesanierung in Regensburg</li>
                    <li>Weiterentwicklung städtischer Klimaschutzmaßnahmen</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">3. Datennutzung bei Ablehnung</h4>
                  <p>
                    Wenn Sie die Datenspeicherung ablehnen, werden Ihre Eingaben ausschließlich lokal in Ihrem Browser 
                    verarbeitet und nicht an Server der Stadt Regensburg übertragen. Die Nutzung erfolgt vollständig anonym.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">4. Ihre Rechte</h4>
                  <p>
                    Sie haben jederzeit das Recht auf Auskunft, Berichtigung, Löschung und Widerspruch bezüglich 
                    Ihrer personenbezogenen Daten. Kontaktieren Sie hierzu die Datenschutzbeauftragte der Stadt Regensburg 
                    unter datenschutz@regensburg.de.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">5. Widerruf der Einwilligung</h4>
                  <p>
                    Sie können Ihre Einwilligung zur Datenspeicherung jederzeit widerrufen. 
                    Dies hat keine Auswirkungen auf die Nutzung der Anwendung.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer with Buttons */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <p className="text-sm text-gray-700 mb-4">
                Möchten Sie der Speicherung und Nutzung Ihrer eingegebenen Daten durch die Stadt Regensburg zustimmen?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleConsent(false)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                >
                  <X className="w-5 h-5" />
                  Ablehnen
                </button>
                <button
                  onClick={() => handleConsent(true)}
                  className="flex-1 px-4 py-3 bg-[#D9291C] text-white rounded-lg hover:bg-[#B8241A] transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Zustimmen
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center">
                Sie können Ihre Entscheidung jederzeit ändern
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}