import { StyleSheet } from '@react-pdf/renderer';

export const pdf = StyleSheet.create({
  page: {
    padding: 48,
    fontFamily: 'Open Sans',
    fontSize: 12,
    color: '#191919',
    backgroundColor: '#ffffff',
  },

  // Typography
  h1: { fontSize: 34, fontWeight: 700, lineHeight: 45 / 34 },
  h2: { fontSize: 24, fontWeight: 700, lineHeight: 32 / 24 },
  sectionHeader: { fontSize: 16, fontWeight: 700, color: '#191919', marginBottom: 10 },
  h3: { fontSize: 14, fontWeight: 700, color: '#191919' },
  h4: { fontSize: 12, fontWeight: 700, color: '#191919' },
  muted: { fontSize: 10, color: '#5f6061' },

  // Card (white box with border, no rounded corners)
  card: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    padding: 16,
  },
});
