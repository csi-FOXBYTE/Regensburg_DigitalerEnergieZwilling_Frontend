import { Typography } from '@/components/ui/typography';

const STEPS = [
  {
    title: 'Energieberatung einholen',
    description:
      'Nutzen Sie diesen Bericht als Grundlage für eine professionelle Energieberatung. Die Beratung wird mit bis zu 80 % der Kosten gefördert (max. 1.300 € für Ein-/Zweifamilienhäuser).',
  },
  {
    title: 'Fördermittel beantragen',
    description:
      'Stellen Sie die Förderanträge vor Beginn der Maßnahmen. Die Energieberatung hilft bei der Auswahl der passenden Programme und der korrekten Antragstellung.',
  },
  {
    title: 'Angebote vergleichen',
    description:
      'Holen Sie mindestens drei Angebote von qualifizierten Fachbetrieben ein. Achten Sie auf Referenzen, Gewährleistung und die Einhaltung der Förderauflagen.',
  },
  {
    title: 'Sanierung umsetzen',
    description:
      'Planen Sie die Reihenfolge der Maßnahmen sinnvoll – idealerweise zuerst die Gebäudehülle, dann die Anlagentechnik. So dimensionieren Sie die neue Heizung optimal.',
  },
];

export function NextStepsSection() {
  return (
    <div className="flex flex-col gap-4">
      <Typography variant="h3">So geht's weiter</Typography>
      <div className="mt-1.5 flex flex-col">
        {STEPS.map((step, index) => (
          <div key={index} className="flex gap-5">
            <div className="flex flex-col items-center">
              <div className="bg-primary flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white">
                {index + 1}
              </div>
              {index < STEPS.length - 1 && (
                <div className="my-1 w-px flex-1 bg-neutral-200" />
              )}
            </div>
            <div className="flex flex-col gap-1 pb-6">
              <Typography variant="h4">{step.title}</Typography>
              <Typography variant="muted">{step.description}</Typography>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
