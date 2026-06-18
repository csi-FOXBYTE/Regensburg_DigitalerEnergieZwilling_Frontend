import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Paper } from '@/components/ui/paper';
import { Typography } from '@/components/ui/typography';
import { EnergyReportDocument } from '@/feature/export/EnergyReportDocument';
import { submitEnergyData } from '@/lib/api/public';
import { downloadPdf } from '@/lib/downloadPdf';
import { $building } from '@/lib/state/building';
import { $versionName } from '@/lib/state/calculation-config';
import { $calculationInput } from '@/lib/state/computed/calculation-input';
import { getSession } from '@/lib/state/session';
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
  const versionName = useStore($versionName);

  function buildRecoveryLink(): string | undefined {
    if (!building) return undefined;
    const session = getSession(building.id);
    if (session) {
      try {
        const encoded = btoa(encodeURIComponent(JSON.stringify(session)));
        return `${window.location.origin}${window.location.pathname}?restore=${encoded}`;
      } catch {}
    }
    return `${window.location.origin}${window.location.pathname}?restore=${building.id}`;
  }

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
            longitude: building.coordinates.lon,
            latitude: building.coordinates.lat,
          });
          const deletionLink = `${window.location.origin}${window.location.pathname}/delete?token=${encodeURIComponent(result.deletionLink)}`;
          // No backend to fetch the JSON later, so embed the data in the link itself.
          const jsonPayload = btoa(encodeURIComponent(JSON.stringify(result)));
          const jsonLink = `${window.location.origin}${window.location.pathname}/delete?download-json=${encodeURIComponent(jsonPayload)}&filename=${encodeURIComponent(`${t('export.reportTitle')}.json`)}`;
          const recoveryLink = buildRecoveryLink();
          await downloadPdf(
            <EnergyReportDocument
              recoveryLink={recoveryLink}
              deletionLink={deletionLink}
              jsonLink={jsonLink}
            />,
            t('export.reportTitle'),
          );
          return;
        } catch {
          toast.error(t('export.submissionError'));
        }
      }

      await downloadPdf(
        <EnergyReportDocument recoveryLink={buildRecoveryLink()} />,
        t('export.reportTitle'),
      );
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
