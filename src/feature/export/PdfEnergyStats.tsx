import { $currentEnergyState } from '@/lib/state/computed/current-energy-state';
import { $renovatedEnergyState } from '@/lib/state/computed/renovated-energy-state';
import { StyleSheet, Text, View } from '@react-pdf/renderer';
import i18next from 'i18next';
import { pdf } from './pdfStyles';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 6,
  },
  card: {
    ...pdf.card,
    flex: 1,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 6,
  },
  beforeLabel: {
    ...pdf.muted,
    marginBottom: 2,
  },
  beforeValue: {
    ...pdf.muted,
    marginBottom: 4,
  },
  divider: {
    borderBottomWidth: 1,
    borderColor: '#e5e5e5',
    marginBottom: 4,
  },
  afterLabel: {
    fontSize: 10,
    color: '#5f6061',
    marginBottom: 2,
  },
  afterValue: {
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 6,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 700,
    color: '#ffffff',
  },
});

function formatValue(value: number) {
  return value.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDelta(value: number) {
  return value.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2, signDisplay: 'always' });
}

function deltaColor(improved: boolean | null) {
  if (improved === true) return '#16a34a';
  if (improved === false) return '#dc2626';
  return '#5f6061';
}

function StatCard({
  title,
  beforeValue,
  afterValue,
  beforeMonthlyValue,
  afterMonthlyValue,
  deltaLabel,
  deltaMonthlyLabel,
  deltaColor: color,
}: {
  title: string;
  beforeValue: string;
  afterValue: string;
  beforeMonthlyValue: string;
  afterMonthlyValue: string;
  deltaLabel: string;
  deltaMonthlyLabel: string;
  deltaColor: string;
}) {
  const t = i18next.t.bind(i18next);
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.beforeLabel}>{t('energyCalculation:stats.beforeRenovation')}</Text>
      <Text style={styles.beforeValue}>{beforeValue}</Text>
      <Text style={[styles.beforeValue, { fontSize: 9, marginBottom: 4 }]}>{beforeMonthlyValue}</Text>
      <View style={styles.divider} />
      <Text style={styles.afterLabel}>{t('energyCalculation:stats.afterRenovation')}</Text>
      <Text style={styles.afterValue}>{afterValue}</Text>
      <Text style={[styles.afterValue, { fontSize: 9, fontWeight: 400, marginBottom: 4 }]}>{afterMonthlyValue}</Text>
      <View style={[styles.badge, { backgroundColor: color }]}>
        <Text style={styles.badgeText}>{deltaLabel}</Text>
        <Text style={[styles.badgeText, { fontSize: 8 }]}>{deltaMonthlyLabel}</Text>
      </View>
    </View>
  );
}

export function PdfEnergyStats() {
  const before = $currentEnergyState.get();
  const after = $renovatedEnergyState.get();
  const t = i18next.t.bind(i18next);

  const energyDelta = after.energyConsumptionPerSquareMeter - before.energyConsumptionPerSquareMeter;
  const costDelta = after.yearlyCost - before.yearlyCost;
  const co2Delta = after.co2Emissions - before.co2Emissions;

  return (
    <View style={styles.row}>
      <StatCard
        title={t('energyCalculation:stats.energyDemand')}
        beforeValue={t('energyCalculation:stats.energyDemandValue', { value: formatValue(before.energyConsumptionPerSquareMeter) })}
        afterValue={t('energyCalculation:stats.energyDemandValue', { value: formatValue(after.energyConsumptionPerSquareMeter) })}
        beforeMonthlyValue={t('energyCalculation:stats.energyDemandMonthlyValue', { value: formatValue(before.energyConsumptionPerSquareMeter / 12) })}
        afterMonthlyValue={t('energyCalculation:stats.energyDemandMonthlyValue', { value: formatValue(after.energyConsumptionPerSquareMeter / 12) })}
        deltaLabel={`${formatDelta(energyDelta)} kWh/m²a`}
        deltaMonthlyLabel={`${formatDelta(energyDelta / 12)} kWh/m²/Monat`}
        deltaColor={deltaColor(energyDelta < 0 ? true : energyDelta > 0 ? false : null)}
      />
      <StatCard
        title={t('energyCalculation:stats.annualCosts')}
        beforeValue={t('energyCalculation:stats.annualCostsValue', { value: formatValue(before.yearlyCost) })}
        afterValue={t('energyCalculation:stats.annualCostsValue', { value: formatValue(after.yearlyCost) })}
        beforeMonthlyValue={t('energyCalculation:stats.monthlyCostsValue', { value: formatValue(before.yearlyCost / 12) })}
        afterMonthlyValue={t('energyCalculation:stats.monthlyCostsValue', { value: formatValue(after.yearlyCost / 12) })}
        deltaLabel={`${formatDelta(costDelta)} €/a`}
        deltaMonthlyLabel={`${formatDelta(costDelta / 12)} €/Monat`}
        deltaColor={deltaColor(costDelta < 0 ? true : costDelta > 0 ? false : null)}
      />
      <StatCard
        title={t('energyCalculation:stats.co2Emissions')}
        beforeValue={t('energyCalculation:stats.co2EmissionsValue', { value: formatValue(before.co2Emissions) })}
        afterValue={t('energyCalculation:stats.co2EmissionsValue', { value: formatValue(after.co2Emissions) })}
        beforeMonthlyValue={t('energyCalculation:stats.co2EmissionsMonthlyValue', { value: formatValue(before.co2Emissions / 12) })}
        afterMonthlyValue={t('energyCalculation:stats.co2EmissionsMonthlyValue', { value: formatValue(after.co2Emissions / 12) })}
        deltaLabel={`${formatDelta(co2Delta)} t CO₂/a`}
        deltaMonthlyLabel={`${formatDelta(co2Delta / 12)} t CO₂/Monat`}
        deltaColor={deltaColor(co2Delta < 0 ? true : co2Delta > 0 ? false : null)}
      />
    </View>
  );
}
