import { Button } from '@/components/ui/button';
import { Callout } from '@/components/ui/callout';
import { Checkbox } from '@/components/ui/checkbox';
import { Typography } from '@/components/ui/typography';
import { EnergyReportDocument } from '@/feature/export/EnergyReportDocument';
import { submitEnergyData } from '@/lib/api/public';
import { downloadPdf } from '@/lib/downloadPdf';
import { $building } from '@/lib/state/building';
import { $versionName } from '@/lib/state/calculation-config';
import { $calculationInput } from '@/lib/state/computed/calculation-input';
import { getSession } from '@/lib/state/session';
import { useStore } from '@nanostores/react';
import { Download, ShieldCheck } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

function TimelineStep({
  index,
  isLast,
  children,
}: {
  index: number;
  isLast: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-5">
      <div className="flex flex-col items-center">
        <div className="bg-primary flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white">
          {index}
        </div>
        {!isLast && <div className="my-1 w-px flex-1 bg-neutral-200" />}
      </div>
      <div className="flex flex-col gap-3 pb-6">{children}</div>
    </div>
  );
}

export function NextStepsSection() {
  const { t } = useTranslation('energyCalculation');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const building = useStore($building);
  const calculationInput = useStore($calculationInput);
  const versionName = useStore($versionName);

  const DOWNLOAD_ITEM_KEYS = [
    'export.downloadItems.recoveryLink',
    'export.downloadItems.dataDonation',
    'export.downloadItems.buildingData',
    'export.downloadItems.scenario',
    'export.downloadItems.nextSteps',
    'export.downloadItems.subsidyLinks',
  ] as const;

  const STEPS = [
    {
      title: t('nextSteps.step1.title'),
      description: t('nextSteps.step1.description'),
      link: 'https://www.energieagentur-regensburg.de/buergerinnen/energieberatung-anmeldung',
      contact:
        'Energieagentur Regensburg e. V.\nRudolf-Vogt-Straße 18\n93053 Regensburg\nTel. 0941 2984491-0\nkontakt@energieagentur-regensburg.de',
    },
    {
      title: t('nextSteps.step2.title'),
      description: t('nextSteps.step2.description'),
    },
    {
      title: t('nextSteps.step3.title'),
      description: t('nextSteps.step3.description'),
    },
    {
      title: t('nextSteps.step4.title'),
      description: t('nextSteps.step4.description'),
    },
  ];

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
          toast.success(t('export.submissionSuccess'));
          const deletionLink = `${window.location.origin}${window.location.pathname}/delete?token=${encodeURIComponent(result.deletionLink)}`;
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
    } catch {
      toast.error(t('export.downloadError'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8 flex flex-col gap-4">
      <Typography variant="h3">{t('nextSteps.sectionTitle')}</Typography>
      <div className="mt-1.5 flex flex-col">
        <TimelineStep index={1} isLast={false}>
          <Typography variant="h4">{t('export.consentTitle')}</Typography>
          <Typography variant="muted" className="whitespace-pre-line">
            {t('export.consentDescription')}
          </Typography>
          <label className="mt-4 block cursor-pointer">
            <Callout
              variant="positive"
              size="large"
              icon={
                <Checkbox
                  checked={consent}
                  onCheckedChange={(v) => setConsent(v === true)}
                  className="border-neutral-550 size-5 border-2"
                />
              }
            >
              <div className="flex flex-col gap-3">
                <Typography variant="small">
                  {t('export.consentLabel')}
                </Typography>
                <div className="flex items-start gap-2">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0" />
                  <Typography variant="small" className="text-xs">
                    {t('export.privacyNote')}
                  </Typography>
                </div>
              </div>
            </Callout>
          </label>
        </TimelineStep>

        <TimelineStep index={2} isLast={false}>
          <Typography variant="h4">{t('export.downloadTitle')}</Typography>
          <Typography variant="muted">{t('export.downloadIntro')}</Typography>
          <ul className="text-muted-foreground flex list-disc flex-col gap-1 pl-5 text-sm">
            {DOWNLOAD_ITEM_KEYS.map((key) => (
              <li key={key}>{t(key)}</li>
            ))}
          </ul>
          <Button
            className="mt-1 flex w-full gap-1 sm:w-fit"
            onClick={handleDownload}
            disabled={loading}
          >
            <Download /> {t('export.downloadButton')}
          </Button>
        </TimelineStep>

        {STEPS.map((step, index) => (
          <TimelineStep
            key={index}
            index={index + 3}
            isLast={index === STEPS.length - 1}
          >
            <Typography variant="h4">{step.title}</Typography>
            <Typography variant="muted" className="flex flex-col gap-4">
              <span className="whitespace-pre-line">{step.description}</span>
              {step.link && (
                <a
                  href={step.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary break-all underline"
                >
                  {step.link}
                </a>
              )}
              {step.contact && (
                <span className="whitespace-pre-line">{step.contact}</span>
              )}
            </Typography>
          </TimelineStep>
        ))}
      </div>
    </div>
  );
}
