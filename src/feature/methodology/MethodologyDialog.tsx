import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FieldLabel } from '@/components/ui/field';
import { Separator } from '@/components/ui/separator';
import { Typography } from '@/components/ui/typography';
import EnergyNumberInput from '@/feature/energyCalculation/EnergyNumberInput';
import { InfoDialogButton } from '@/feature/energyCalculation/InfoButton';
import makeFieldStore from '@/lib/field-store';
import { $step, Step } from '@/lib/state/ui/progress';
import { useStore } from '@nanostores/react';
import {
  AlertTriangle,
  BookOpenText,
  Database,
} from 'lucide-react';
import { atom } from 'nanostores';
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

const NOTICE_VERSION = 'v1';
const NOTICE_STORAGE_KEY = `det_methodology_notice_seen_${NOTICE_VERSION}`;
const DEMO_AUTOMATIC_AREA = 140;

type DemoInputState = {
  livingArea?: number;
};

function hasSeenNotice(): boolean {
  try {
    return localStorage.getItem(NOTICE_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

function markNoticeAsSeen(): void {
  try {
    localStorage.setItem(NOTICE_STORAGE_KEY, 'true');
  } catch {
    // The dialog still works when browser storage is unavailable.
  }
}

function PlaceholderCopy({ children }: { children: ReactNode }) {
  const { t } = useTranslation('methodology');

  return (
    <div className="border-primary/40 bg-primary/5 flex flex-col gap-2 border border-dashed p-4">
      <Badge variant="destructive">{t('draft.contentBadge')}</Badge>
      <Typography variant="small">{children}</Typography>
    </div>
  );
}

function DemoInput() {
  const { t, i18n } = useTranslation('methodology');
  const inputId = useId();

  // These stores intentionally live inside the dialog content. Radix unmounts
  // this component when the dialog closes, so every opening starts fresh.
  const [inputStore] = useState(() => atom<DemoInputState>({}));
  const [automaticValueStore] = useState(() =>
    atom<DemoInputState>({ livingArea: DEMO_AUTOMATIC_AREA }),
  );
  const [livingAreaField] = useState(() =>
    makeFieldStore({
      store: inputStore,
      placeholderStore: automaticValueStore,
      getValue: (state) => state.livingArea,
      setValue: (draft, value: number | undefined) => {
        draft.livingArea = value;
      },
      resettable: true,
    }),
  );

  const userValue = useStore(livingAreaField.$store);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <Typography as="h3" variant="h4">
          {t('demo.inputExplanationTitle')}
        </Typography>
        <Typography>{t('demo.inputExplanationText')}</Typography>
      </div>

      <Separator />

      <div className="flex w-full max-w-2xl flex-col gap-5">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Database
              className="text-muted-foreground size-5"
              aria-hidden="true"
            />
            <Typography as="span" variant="small" className="font-bold">
              {t('demo.automaticValueLabel')}
            </Typography>
          </div>
          <Typography variant="h4">
            {DEMO_AUTOMATIC_AREA.toLocaleString(i18n.language)} m²
          </Typography>
          <Typography>{t('demo.automaticValueHint')}</Typography>
        </div>

        <Separator />

        <div className="flex w-fit items-center gap-2">
          <FieldLabel htmlFor={inputId}>{t('demo.inputLabel')}</FieldLabel>
          <InfoDialogButton
            title={t('demo.infoDialog.title')}
            content={t('demo.infoDialog.description')}
          />
        </div>
        <EnergyNumberInput
          field={livingAreaField}
          id={inputId}
          aria-label={t('demo.inputLabel')}
          suffix=" m²"
          decimalScale={1}
          allowNegative={false}
          isAllowed={({ floatValue }) => floatValue == null || floatValue >= 0}
        />
        <Typography>
          {userValue == null
            ? t('demo.automaticExplanation')
            : t('demo.userValueExplanation')}
        </Typography>
      </div>
    </div>
  );
}

function MethodologyDialogContent() {
  const { t } = useTranslation('methodology');

  return (
    <DialogContent className="top-0 left-0 flex h-dvh max-h-dvh w-full max-w-none translate-x-0 translate-y-0 flex-col gap-0 rounded-none border-0 p-0 sm:top-1/2 sm:left-1/2 sm:h-[min(88dvh,56rem)] sm:w-[calc(100%-3rem)] sm:max-w-5xl sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-lg sm:border">
      <DialogHeader className="shrink-0 border-b border-neutral-200 px-5 py-4 pr-16 sm:px-8 sm:py-6 sm:pr-16">
        <div className="flex items-start gap-3">
          <span className="bg-muted text-primary flex size-11 shrink-0 items-center justify-center rounded-full">
            <BookOpenText className="size-6" aria-hidden="true" />
          </span>
          <div className="flex min-w-0 flex-col gap-1">
            <DialogTitle>{t('title')}</DialogTitle>
            <DialogDescription>{t('description')}</DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-8 sm:py-6">
        <div className="mx-auto flex max-w-4xl flex-col gap-6">
          <section
            className="border-primary bg-primary/5 flex gap-3 border-2 p-4"
            aria-labelledby="methodology-draft-title"
          >
            <AlertTriangle
              className="text-primary mt-0.5 size-6 shrink-0"
              aria-hidden="true"
            />
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="destructive">{t('draft.badge')}</Badge>
                <Typography id="methodology-draft-title" as="h2" variant="h4">
                  {t('draft.title')}
                </Typography>
              </div>
              <Typography variant="small">{t('draft.description')}</Typography>
            </div>
          </section>

          <section className="flex flex-col gap-3" aria-labelledby="demo-title">
            <div>
              <Typography id="demo-title" as="h2" variant="h3">
                {t('demo.title')}
              </Typography>
              <Typography variant="muted">{t('demo.description')}</Typography>
            </div>
            <DemoInput />
            <PlaceholderCopy>{t('demo.placeholder')}</PlaceholderCopy>
          </section>

          <section
            className="flex flex-col gap-3"
            aria-labelledby="topics-title"
          >
            <div>
              <Typography id="topics-title" as="h2" variant="h3">
                {t('sectionsTitle')}
              </Typography>
              <Typography variant="muted">
                {t('sectionsDescription')}
              </Typography>
            </div>

            <Accordion
              type="multiple"
              defaultValue={['scope', 'data', 'inputs']}
            >
              <AccordionItem value="scope">
                <AccordionTrigger>{t('sections.scope.title')}</AccordionTrigger>
                <AccordionContent>
                  <PlaceholderCopy>
                    {t('sections.scope.placeholder')}
                  </PlaceholderCopy>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="data">
                <AccordionTrigger>{t('sections.data.title')}</AccordionTrigger>
                <AccordionContent>
                  <PlaceholderCopy>
                    {t('sections.data.placeholder')}
                  </PlaceholderCopy>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="inputs">
                <AccordionTrigger>
                  {t('sections.inputs.title')}
                </AccordionTrigger>
                <AccordionContent>
                  <PlaceholderCopy>
                    {t('sections.inputs.placeholder')}
                  </PlaceholderCopy>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="model">
                <AccordionTrigger>{t('sections.model.title')}</AccordionTrigger>
                <AccordionContent>
                  <PlaceholderCopy>
                    {t('sections.model.placeholder')}
                  </PlaceholderCopy>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="energy">
                <AccordionTrigger>
                  {t('sections.energy.title')}
                </AccordionTrigger>
                <AccordionContent>
                  <PlaceholderCopy>
                    {t('sections.energy.placeholder')}
                  </PlaceholderCopy>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="assumptions">
                <AccordionTrigger>
                  {t('sections.assumptions.title')}
                </AccordionTrigger>
                <AccordionContent>
                  <PlaceholderCopy>
                    {t('sections.assumptions.placeholder')}
                  </PlaceholderCopy>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="limits">
                <AccordionTrigger>
                  {t('sections.limits.title')}
                </AccordionTrigger>
                <AccordionContent>
                  <PlaceholderCopy>
                    {t('sections.limits.placeholder')}
                  </PlaceholderCopy>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
        </div>
      </div>

      <div className="bg-background shrink-0 border-t border-neutral-200 px-5 py-3 sm:px-8">
        <Typography variant="verySmall">{t('footer')}</Typography>
      </div>
    </DialogContent>
  );
}

export default function MethodologyDialog() {
  const { t } = useTranslation('methodology');
  const step = useStore($step);
  const [open, setOpen] = useState(false);
  const autoOpenHandled = useRef(false);

  useEffect(() => {
    if (autoOpenHandled.current || step < Step.GeneralData) return;

    autoOpenHandled.current = true;
    if (hasSeenNotice()) return;

    markNoticeAsSeen();
    setOpen(true);
  }, [step]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="elevated"
          size="default"
          className="text-primary hover:text-primary-hover fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-4 z-40 h-14 rounded-full px-4 shadow-[0_4px_12px_0px_rgba(0,0,0,0.22)] hover:bg-white hover:shadow-[0_0_12px_4px_rgba(0,0,0,0.15)] sm:left-6"
          aria-label={t('trigger')}
        >
          <BookOpenText className="size-6" aria-hidden="true" />
          <span className="hidden sm:inline">{t('trigger')}</span>
        </Button>
      </DialogTrigger>
      {open && <MethodologyDialogContent />}
    </Dialog>
  );
}
