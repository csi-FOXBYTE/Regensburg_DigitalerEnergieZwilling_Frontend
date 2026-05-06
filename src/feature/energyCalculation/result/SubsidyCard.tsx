import { ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Paper } from '@/components/ui/paper';
import { Typography } from '@/components/ui/typography';
import type { Subsidy, SubsidyBenefit } from '@csi-foxbyte/regensburg_digitalerenergiezwilling_energycalculationcore';

function formatBenefit(benefit: SubsidyBenefit, upToLabel: string): string {
  const num = (n: number) => n.toLocaleString('de-DE');

  let amount: string;
  if (benefit.type === 'range') {
    amount = `${num(benefit.from)} – ${num(benefit.to)} ${benefit.unit}`;
  } else if (benefit.type === 'upTo') {
    amount = `${upToLabel} ${num(benefit.value)} ${benefit.unit}`;
  } else {
    amount = `${num(benefit.value)} ${benefit.unit}`;
  }

  return benefit.for ? `${amount} · ${benefit.for}` : amount;
}

export function SubsidyCard({ title, content, href, benefits }: Subsidy) {
  const { t } = useTranslation('energyCalculation');

  return (
    <Paper className="flex flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-3">
        <Typography variant="h4">{title}</Typography>
        <Badge className="shrink-0 border-green-600 bg-green-600/10 text-green-600">
          {formatBenefit(benefits, t('subsidy.benefitUpTo'))}
        </Badge>
      </div>
      <div className="text-sm text-foreground [&_a]:underline [&_li]:ml-4 [&_li]:list-disc [&_ol]:my-1 [&_p]:my-1 [&_strong]:font-semibold [&_ul]:my-1">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto flex w-fit items-center gap-1 text-sm text-primary underline-offset-4 hover:underline"
      >
        {t('subsidy.moreInfo')}
        <ExternalLink className="size-3.5" />
      </a>
    </Paper>
  );
}
