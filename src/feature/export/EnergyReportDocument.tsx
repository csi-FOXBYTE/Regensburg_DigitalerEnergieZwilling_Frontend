import { $building } from '@/lib/state/building';
import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import i18next from 'i18next';
import './registerPdfFonts';
import { LabeledRow } from './LabeledRow';
import { PdfEnergyClassBars } from './PdfEnergyClassBars';
import { PdfEnergyStats } from './PdfEnergyStats';
import { PdfFooter } from './PdfFooter';
import { PdfHeader } from './PdfHeader';
import { PdfNextSteps } from './PdfNextSteps';
import { PdfRenovationScenarios } from './PdfRenovationScenarios';
import { pdf } from './pdfStyles';

const styles = StyleSheet.create({
  titleSection: {
    marginBottom: 24,
  },
  documentTitle: {
    ...pdf.h1,
    marginBottom: 6,
  },
  documentSubtitle: {
    fontSize: 18,
    color: '#5f6061',
    lineHeight: 28 / 18,
  },
  section: {
    marginBottom: 16,
  },
  sectionGap: {
    marginBottom: 20,
  },
});

export function EnergyReportDocument(_props: { deletionLink?: string }) {
  const building = $building.get();
  const addr = building?.properties.address;
  const address = addr ? `${addr.street}\n${addr.city}` : '–';

  const reportDate = new Date().toLocaleDateString(i18next.language, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <Document title="Energiebericht" hyphenationCallback={(word) => [word]}>
      <Page size="A4" style={pdf.page}>
        <PdfHeader title={i18next.t('energyCalculation:export.reportTitle')} />
        <View style={styles.titleSection}>
          <Text style={styles.documentTitle}>
            {i18next.t('energyCalculation:export.documentTitle')}
          </Text>
          <Text style={styles.documentSubtitle}>
            {i18next.t('energyCalculation:export.documentSubtitle')}
          </Text>
        </View>
        <View style={styles.section}>
          <LabeledRow label={i18next.t('energyCalculation:export.building')} value={address} />
          <LabeledRow label={i18next.t('energyCalculation:export.reportDate')} value={reportDate} />
        </View>
        <View style={styles.sectionGap}>
          <Text style={pdf.sectionHeader}>
            {i18next.t('energyCalculation:export.sectionEnergyEfficiency')}
          </Text>
          <View wrap={false} style={{ marginBottom: 12 }}>
            <PdfEnergyStats />
          </View>
          <View wrap={false}>
            <PdfEnergyClassBars />
          </View>
        </View>
        <PdfFooter />
      </Page>
      <Page size="A4" style={pdf.page}>
        <PdfHeader title={i18next.t('energyCalculation:export.reportTitle')} />
        <PdfRenovationScenarios />
        <PdfFooter />
      </Page>
      <Page size="A4" style={pdf.page}>
        <PdfHeader title={i18next.t('energyCalculation:export.reportTitle')} />
        <PdfNextSteps />
        <PdfFooter />
      </Page>
    </Document>
  );
}
