import type { ReactNode } from 'react';

export type RenovationRowProps = {
  selectionCell: ReactNode;
  label: string;
  savings: number;
};

function formatSavings(savings: number) {
  return savings.toLocaleString('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: 'always',
  });
}

export function RenovationRow({ selectionCell, label, savings }: RenovationRowProps) {
  const colorClass =
    savings < 0 ? 'text-green-600' : savings > 0 ? 'text-red-600' : 'text-muted-foreground';

  return (
    <tr className="border-t border-neutral-200 text-base">
      <td className="w-8 px-4 py-4">{selectionCell}</td>
      <td className="px-4 py-4">{label}</td>
      <td className={`whitespace-nowrap px-4 py-4 text-right ${colorClass}`}>
        {formatSavings(savings)} €/a
      </td>
    </tr>
  );
}
