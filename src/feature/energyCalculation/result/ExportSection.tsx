import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Paper } from '@/components/ui/paper';
import { Typography } from '@/components/ui/typography';
import { EnergyReportDocument } from '@/feature/export/EnergyReportDocument';
import { downloadPdf } from '@/lib/downloadPdf';
import { Download, HeartHandshake, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function ExportSection() {
  const { t } = useTranslation('energyCalculation');
  const [consent, setConsent] = useState(false);

  async function handleDownload() {
    await downloadPdf(<EnergyReportDocument />, t('export.reportTitle'));
  }

  return (
    <div className="flex flex-col gap-4">
      <Typography variant="h3">{t('export.sectionTitle')}</Typography>
      <Paper className="flex flex-col gap-4 p-4">
        <Typography>{t('export.description')}</Typography>

        <div className="flex flex-col gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
          <div className="flex items-start gap-3">
            <HeartHandshake className="mt-0.5 size-5 shrink-0 text-green-600" />
            <div className="flex flex-col gap-1">
              <Typography variant="h4">{t('export.consentTitle')}</Typography>
              <Typography variant="muted">
                {t('export.consentDescription')}
              </Typography>
            </div>
          </div>

          <label className="flex cursor-pointer items-start gap-3">
            <Checkbox
              checked={consent}
              onCheckedChange={(v) => setConsent(v === true)}
              className="mt-0.5 border border-black bg-white"
            />
            <Typography variant="small">{t('export.consentLabel')}</Typography>
          </label>

          <div className="text-muted-foreground flex items-start gap-2">
            <ShieldCheck className="mt-0.5 size-4 shrink-0" />
            <Typography variant="muted" className="text-xs">
              {t('export.privacyNote')}
            </Typography>
          </div>
        </div>

        <Button className="flex w-full gap-1" onClick={handleDownload}>
          <Download /> {t('export.downloadButton')}
        </Button>
      </Paper>
    </div>
  );
}
