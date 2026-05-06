import type { Subsidy } from '@csi-foxbyte/regensburg_digitalerenergiezwilling_energycalculationcore';

export const DUMMY_SUBSIDIES: Subsidy[] = [
  {
    title: 'Bundesförderung für effiziente Gebäude (BEG)',
    content: `
Die BEG fördert energetische Sanierungsmaßnahmen an Wohngebäuden.
Gefördert werden u. a. Dämmmaßnahmen, der Austausch von Fenstern und Türen sowie die Erneuerung der Heizungsanlage.

**Voraussetzung:** Das Gebäude muss mindestens 5 Jahre alt sein.
Die Maßnahmen müssen von einem zugelassenen Energieberater begleitet werden.
    `.trim(),
    href: 'https://www.bafa.de/DE/Energie/Effiziente_Gebaeude/effiziente_gebaeude_node.html',
    benefits: {
      type: 'upTo',
      value: 30000,
      unit: '€',
      for: 'pro Wohneinheit',
    },
  },
  {
    title: 'KfW-Programm 261 – Bundesförderung für effiziente Gebäude',
    content: `
Zinsgünstige Kredite und Tilgungszuschüsse für die Sanierung zum **KfW-Effizienzhaus**.
Je höher der energetische Standard nach der Sanierung, desto höher der Tilgungszuschuss.

- Effizienzhaus 40: bis zu 45 % Tilgungszuschuss
- Effizienzhaus 55: bis zu 30 % Tilgungszuschuss
- Effizienzhaus 70: bis zu 15 % Tilgungszuschuss
    `.trim(),
    href: 'https://www.kfw.de/inlandsfoerderung/Privatpersonen/Bestehende-Immobilie/Energieeffizient-Sanieren/KfW-Effizienzhaus/',
    benefits: {
      type: 'range',
      from: 15,
      to: 45,
      unit: '%',
      for: 'Tilgungszuschuss',
    },
  },
  {
    title: 'Heizungsförderung – Wärmepumpe',
    content: `
Beim Austausch einer fossilen Heizung gegen eine **Wärmepumpe** können mehrere Förderbausteine kombiniert werden:

- Grundförderung: 30 %
- Klimageschwindigkeitsbonus: +20 % (bis 2028)
- Einkommensbonus: +30 % (zu versteuerndes Haushaltseinkommen ≤ 40.000 €)
    `.trim(),
    href: 'https://www.bafa.de/DE/Energie/Effiziente_Gebaeude/Bundesfoerderung_Heizungsoptimierung/bundesfoerderung_heizungsoptimierung_node.html',
    benefits: {
      type: 'upTo',
      value: 70,
      unit: '%',
      for: 'der förderfähigen Kosten',
    },
  },
  {
    title: 'Städtische Förderung Regensburg – Energetische Sanierung',
    content: `
Die Stadt Regensburg unterstützt Eigentümer mit einem Zuschuss für energetische Sanierungsmaßnahmen im Stadtgebiet.
Das Programm ergänzt die Bundesförderung und kann mit BEG-Mitteln kombiniert werden.
    `.trim(),
    href: 'https://www.regensburg.de/rathaus/aemter-und-behoerden/stadtplanungsamt/energie-und-klimaschutz',
    benefits: {
      type: 'exactly',
      value: 2000,
      unit: '€',
    },
  },
];
