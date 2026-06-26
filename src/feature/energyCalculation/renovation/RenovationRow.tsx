import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';

export type RenovationRowProps = {
  selectionCell: ReactNode;
  label: string;
  savings: number;
  recommended?: boolean;
  info?: ReactNode;
};

function formatSavings(savings: number) {
  return savings.toLocaleString('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: 'always',
  });
}

export function RenovationRow({ selectionCell, label, savings, recommended, info }: RenovationRowProps) {
  const { t } = useTranslation('energyCalculation');
  const colorClass =
    savings < 0 ? 'text-green-600' : savings > 0 ? 'text-red-600' : 'text-muted-foreground';

  return (
    <tr className="border-t border-neutral-200 text-base">
      <td className="w-8 px-4 py-4 align-top">{selectionCell}</td>
      <td className="px-4 py-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <span className="flex flex-col items-start gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
            <span className="flex items-center gap-2">
              {label}
              {info}
            </span>
            {recommended && (
              <Badge className="border-green-600 bg-green-600/10 text-green-600">
                {t('renovation.recommended')}
              </Badge>
            )}
          </span>
          <span className={`whitespace-nowrap sm:text-right ${colorClass}`}>
            {formatSavings(savings)} €/a
          </span>
        </div>
      </td>
    </tr>
  );
}
