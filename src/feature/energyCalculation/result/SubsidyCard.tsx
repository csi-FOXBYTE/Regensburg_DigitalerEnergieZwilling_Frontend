import { Badge } from '@/components/ui/badge';
import { Paper } from '@/components/ui/paper';
import { Typography } from '@/components/ui/typography';
import type {
  Subsidy,
  SubsidyBenefit,
} from '@csi-foxbyte/regensburg_digitalerenergiezwilling_energycalculationcore';
import { ChevronDown, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Paper
      className="flex cursor-pointer flex-col gap-3 p-4"
      onClick={() => setIsOpen((prev) => !prev)}
    >
      <Badge className="h-auto border-green-600 bg-green-600/10 whitespace-normal text-green-600">
        {formatBenefit(benefits, t('subsidy.benefitUpTo'))}
      </Badge>
      <Typography variant="h4">{title}</Typography>
      <div className="relative">
        <div
          className={`text-foreground overflow-hidden text-sm transition-[max-height] duration-300 ease-in-out [&_a]:underline [&_li]:ml-4 [&_li]:list-disc [&_ol]:my-1 [&_p]:my-1 [&_strong]:font-semibold [&_ul]:my-1 ${
            isOpen ? 'max-h-[600px]' : 'max-h-[4.5rem]'
          }`}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
        {!isOpen && (
          <div className="from-card pointer-events-none absolute right-0 bottom-0 left-0 h-8 bg-gradient-to-t to-transparent" />
        )}
      </div>
      {isOpen && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary flex w-fit items-center gap-1 text-sm underline-offset-4 hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {t('subsidy.moreInfo')}
          <ExternalLink className="size-3.5" />
        </a>
      )}
      <div className="mt-auto flex items-center justify-between">
        <ChevronDown
          className={`text-muted-foreground size-4 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </div>
    </Paper>
  );
}
