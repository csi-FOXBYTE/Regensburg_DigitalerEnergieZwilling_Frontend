import { StyleSheet, Text, View } from '@react-pdf/renderer';
import i18next from 'i18next';
import { LabeledRow } from './LabeledRow';
import { pdf } from './pdfStyles';

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
});

function formatDelta(value: number) {
  return value.toLocaleString('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: 'always',
  });
}

type Props = {
  label: string;
  energySavingPercent: number;
  costSaving: number;
};

export function PdfRenovationItem({ label, energySavingPercent, costSaving }: Props) {
  const t = i18next.t.bind(i18next);
  return (
    <View wrap={false} style={styles.container}>
      <Text style={pdf.h4}>{label}</Text>
      <LabeledRow
        label={t('energyCalculation:export.energySavings')}
        value={`${formatDelta(energySavingPercent)} %`}
      />
      <LabeledRow
        label={t('energyCalculation:export.costSavings')}
        value={`${formatDelta(costSaving)} €/a`}
      />
      <LabeledRow
        label={t('energyCalculation:export.costSavingsMonthly')}
        value={`${formatDelta(costSaving / 12)} €/Monat`}
      />
    </View>
  );
}
