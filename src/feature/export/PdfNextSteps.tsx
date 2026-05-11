import { StyleSheet, Text, View } from '@react-pdf/renderer';
import { pdf } from './pdfStyles';

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

const styles = StyleSheet.create({
  content: {
    gap: 16,
  },
  step: {
    gap: 4,
  },
  stepDescription: {
    lineHeight: 1,
  },
});

export function PdfNextSteps() {
  return (
    <View style={styles.content}>
      <Text style={pdf.sectionHeader}>So geht's weiter</Text>
      {STEPS.map((step, index) => (
        <View key={index} wrap={false} style={styles.step}>
          <Text style={pdf.h3}>
            {index + 1}. {step.title}
          </Text>
          <Text style={styles.stepDescription}>{step.description}</Text>
        </View>
      ))}
    </View>
  );
}
