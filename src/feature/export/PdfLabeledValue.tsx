import { StyleSheet, Text, View } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  field: {
    width: '33%',
    paddingRight: 12,
    marginBottom: 5,
  },
  label: {
    fontSize: 8,
    color: '#5f6061',
    marginBottom: 2,
    lineHeight: 1.3,
  },
  value: {
    fontSize: 11,
    color: '#191919',
  },
});

type Props = {
  label: string;
  value: string;
};

export function PdfLabeledValue({ label, value }: Props) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}
