import { Button } from '@/components/ui/button';
import { Paper } from '@/components/ui/paper';
import { Typography } from '@/components/ui/typography';
import { EnergyReportDocument } from '@/feature/export/EnergyReportDocument';
import { downloadPdf } from '@/lib/downloadPdf';
import { Download } from 'lucide-react';

export function ExportSection() {
  async function handleDownload() {
    await downloadPdf(<EnergyReportDocument />, 'Energiebericht');
  }

  return (
    <div className="flex flex-col gap-4">
      <Typography variant="h3">Bericht exportieren</Typography>
      <Paper className="flex flex-col gap-4 p-4">
        <Typography>
          Laden Sie einen übersichtlichen PDF-Bericht mit allen
          Berechnungsergebnissen herunter.
        </Typography>
        <Button className="flex w-full gap-1" onClick={handleDownload}>
          <Download /> PDF-Bericht herunterladen
        </Button>
      </Paper>
    </div>
  );
}
