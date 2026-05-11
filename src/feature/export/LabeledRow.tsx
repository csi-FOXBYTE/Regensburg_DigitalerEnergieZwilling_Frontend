import { StyleSheet, Text, View } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  label: {
    width: '60%',
    fontSize: 12,
    lineHeight: 18 / 12,
    color: '#191919',
  },
  value: {
    width: '40%',
    fontSize: 12,
    lineHeight: 18 / 12,
    color: '#191919',
    fontWeight: 700,
  },
});

type Props = {
  label: string;
  value: string;
};

export function LabeledRow({ label, value }: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}
