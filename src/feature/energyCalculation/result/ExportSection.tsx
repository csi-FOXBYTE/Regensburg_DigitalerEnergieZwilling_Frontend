import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Paper } from '@/components/ui/paper';
import { Typography } from '@/components/ui/typography';
import { EnergyReportDocument } from '@/feature/export/EnergyReportDocument';
import { submitEnergyData } from '@/lib/api/public';
import { $building } from '@/lib/state/building';
import { $versionName } from '@/lib/state/calculation-config';
import { $calculationInput } from '@/lib/state/computed/calculation-input';
import { $cameraPosition } from '@/lib/state/session';
import { downloadJson } from '@/lib/downloadJson';
import { downloadPdf } from '@/lib/downloadPdf';
import { useStore } from '@nanostores/react';
import { Download, HeartHandshake, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export function ExportSection() {
  const { t } = useTranslation('energyCalculation');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const building = useStore($building);
  const calculationInput = useStore($calculationInput);
  const cameraPosition = useStore($cameraPosition);
  const versionName = useStore($versionName);

  async function handleDownload() {
    setLoading(true);
    try {
      if (consent && building) {
        const address = building.properties.address
          ? [
              building.properties.address.street,
              [
                building.properties.address.postcode,
                building.properties.address.city,
              ]
                .filter(Boolean)
                .join(' '),
            ]
              .filter(Boolean)
              .join(', ')
          : '';

        try {
          const result = await submitEnergyData({
            input: calculationInput,
            configName: versionName,
            buildingId: building.id,
            address,
            longitude: (cameraPosition?.lon ?? 0) * (180 / Math.PI),
            latitude: (cameraPosition?.lat ?? 0) * (180 / Math.PI),
          });
          downloadJson(result, t('export.reportTitle'));
          await downloadPdf(
            <EnergyReportDocument deletionLink={result.deletionLink} />,
            t('export.reportTitle'),
          );
          return;
        } catch {
          toast.error(t('export.submissionError'));
        }
      }

      await downloadPdf(<EnergyReportDocument />, t('export.reportTitle'));
    } finally {
      setLoading(false);
    }
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

        <Button className="flex w-full gap-1" onClick={handleDownload} disabled={loading}>
          <Download /> {t('export.downloadButton')}
        </Button>
      </Paper>
    </div>
  );
}
