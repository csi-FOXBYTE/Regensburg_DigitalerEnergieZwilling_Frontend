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
  deltaLabel,
  deltaColor: color,
}: {
  title: string;
  beforeValue: string;
  afterValue: string;
  deltaLabel: string;
  deltaColor: string;
}) {
  const t = i18next.t.bind(i18next);
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.beforeLabel}>{t('energyCalculation:stats.beforeRenovation')}</Text>
      <Text style={styles.beforeValue}>{beforeValue}</Text>
      <View style={styles.divider} />
      <Text style={styles.afterLabel}>{t('energyCalculation:stats.afterRenovation')}</Text>
      <Text style={styles.afterValue}>{afterValue}</Text>
      <View style={[styles.badge, { backgroundColor: color }]}>
        <Text style={styles.badgeText}>{deltaLabel}</Text>
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
        deltaLabel={`${formatDelta(energyDelta)} kWh/m²a`}
        deltaColor={deltaColor(energyDelta < 0 ? true : energyDelta > 0 ? false : null)}
      />
      <StatCard
        title={t('energyCalculation:stats.annualCosts')}
        beforeValue={t('energyCalculation:stats.annualCostsValue', { value: formatValue(before.yearlyCost) })}
        afterValue={t('energyCalculation:stats.annualCostsValue', { value: formatValue(after.yearlyCost) })}
        deltaLabel={`${formatDelta(costDelta)} €/a`}
        deltaColor={deltaColor(costDelta < 0 ? true : costDelta > 0 ? false : null)}
      />
      <StatCard
        title={t('energyCalculation:stats.co2Emissions')}
        beforeValue={t('energyCalculation:stats.co2EmissionsValue', { value: formatValue(before.co2Emissions) })}
        afterValue={t('energyCalculation:stats.co2EmissionsValue', { value: formatValue(after.co2Emissions) })}
        deltaLabel={`${formatDelta(co2Delta)} t CO₂/a`}
        deltaColor={deltaColor(co2Delta < 0 ? true : co2Delta > 0 ? false : null)}
      />
    </View>
  );
}
