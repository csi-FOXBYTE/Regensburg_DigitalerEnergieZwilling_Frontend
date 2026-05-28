import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Paper } from '@/components/ui/paper';
import { Typography } from '@/components/ui/typography';
import { EnergyReportDocument } from '@/feature/export/EnergyReportDocument';
import { downloadPdf } from '@/lib/downloadPdf';
import { Download, HeartHandshake, ShieldCheck } from 'lucide-react';

export function ExportSection() {
  const [consent, setConsent] = useState(false);

  async function handleDownload() {
    await downloadPdf(<EnergyReportDocument />, 'Energiebericht');
  }

  return (
    <div className="flex flex-col gap-4">
      <Typography variant="h3">Bericht exportieren</Typography>
      <Paper className="flex flex-col gap-4 p-4">
        <Typography>
          Laden Sie einen übersichtlichen PDF-Bericht mit allen
          Berechnungsergebnissen, Wirtschaftlichkeitsberechnungen und
          Förderprogrammen herunter.
        </Typography>

        <div className="flex flex-col gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
          <div className="flex items-start gap-3">
            <HeartHandshake className="mt-0.5 size-5 shrink-0 text-green-600" />
            <div className="flex flex-col gap-1">
              <Typography variant="h4">
                Helfen Sie Regensburg bei der Wärmeplanung
              </Typography>
              <Typography variant="muted">
                Wenn Sie zustimmen, werden Ihre Berechnungsergebnisse
                vollständig anonymisiert an die Stadtverwaltung übermittelt.
                Diese Daten helfen der Stadt, Klimaprojekte und die kommunale
                Wärmeplanung besser auf die tatsächlichen Bedürfnisse der
                Gebäudeeigentümer auszurichten – ohne Rückschluss auf Ihre
                Person.
              </Typography>
            </div>
          </div>

          <label className="flex cursor-pointer items-start gap-3">
            <Checkbox
              checked={consent}
              onCheckedChange={(v) => setConsent(v === true)}
              className="mt-0.5 bg-white"
            />
            <Typography variant="small">
              Ja, ich möchte meine anonymisierten Ergebnisse freiwillig zur
              Verfügung stellen und damit einen Beitrag zum Klimaschutz in
              Regensburg leisten.
            </Typography>
          </label>

          <div className="flex items-start gap-2 text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-4 shrink-0" />
            <Typography variant="muted" className="text-xs">
              Datenschutz gemäß DSGVO Art. 6 Abs. 1 lit. a: Ihre Einwilligung
              ist freiwillig und jederzeit widerrufbar. Es werden keine
              personenbezogenen Daten übertragen – nur aggregierte Gebäude- und
              Energiekennwerte.
            </Typography>
          </div>
        </div>

        <Button className="flex w-full gap-1" onClick={handleDownload}>
          <Download /> PDF-Bericht herunterladen
        </Button>
      </Paper>
    </div>
  );
}
