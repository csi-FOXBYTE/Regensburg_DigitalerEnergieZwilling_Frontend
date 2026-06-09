import type { Subsidy } from '@csi-foxbyte/regensburg_digitalerenergiezwilling_energycalculationcore';

export const DUMMY_SUBSIDIES: Subsidy[] = [
  {
    title: 'BEG WG – Effizienzhaus-Kredit (KfW 261)',
    content: `
Zinsgünstiger Kredit + nicht rückzahlbarer Tilgungszuschuss für die Komplettsanierung zum Effizienzhaus-Standard. Antrag über die Hausbank.

**Tilgungszuschuss je Effizienzhaus-Stufe:**
EH 85: 5 % | EH 70: 10 % | EH 55: 15 % | EH 40: 20 %

**Boni (kumulierbar):**
+5 % Erneuerbare-Energien-Klasse (EE)
+10 % Worst Performing Building (WPB)
+15 % Seriell-Sanierung (vorgefertigte Fassadenmodule)

**Voraussetzungen:** Bestandsgebäude mindestens 5 Jahre alt. Energieeffizienz-Experte (dena-Liste) verpflichtend. Antrag vor Auftragsvergabe. Nicht kombinierbar mit §35c EStG für dieselben Maßnahmen.
    `.trim(),
    href: 'https://www.kfw.de/261',
    benefits: {
      type: 'upTo',
      value: 37500,
      unit: '€',
      for: 'pro Wohneinheit (EH 40 + EE-Klasse)',
    },
  },
  {
    title: 'Heizungsförderung – Wohngebäude (KfW 458)',
    content: `
Direktzuschuss für den Austausch alter Heizsysteme gegen erneuerbare Alternativen (Wärmepumpe, Solarthermie, Biomasse, Fernwärme).

**Zuschuss-Bausteine:**
30 % Grundförderung (immer)
+5 % Effizienzbonus (Wärmepumpe mit Wasser-/Erdreich-/Abwasserquelle oder Kältemittel R290)
+20 % Klimageschwindigkeitsbonus (Ersatz von Öl-/Kohle-/Gasetagenheizung, Nachtspeicher oder Gas-/Biomasse-Heizung ≥ 20 Jahre alt)
+30 % Einkommensbonus (Haushaltseinkommen ≤ 40.000 €/Jahr, nur Eigennutzer)

Förderfähige Kosten: max. 30.000 €/WE (1. WE), 15.000 € (WE 2–6), 8.000 € (WE 7+).

**Voraussetzungen:** Bestandsgebäude mindestens 5 Jahre alt. Hydraulischer Abgleich als Nebenmaßnahme erforderlich. Direktantrag über KfW-Portal „Meine KfW". Für Vermieter max. 50 % (kein Einkommensbonus). Nicht kombinierbar mit §35c EStG für dieselbe Maßnahme.
    `.trim(),
    href: 'https://www.kfw.de/458',
    benefits: {
      type: 'upTo',
      value: 21000,
      unit: '€',
      for: 'pro Wohneinheit (70 % × 30.000 €)',
    },
  },
  {
    title: 'BEG Einzelmaßnahmen Ergänzungskredit (KfW 358/359)',
    content: `
Zinsgünstiges Darlehen zur Ergänzungsfinanzierung des Eigenanteils nach einem BEG-EM- (BAFA) oder Heizungsförderungs-Zuschuss (KfW 458).

**KfW 358 Plus** (stark verbilligter Zins, ab 0,01 % eff. p.a.): Nur Eigennutzer mit Haushaltseinkommen ≤ 90.000 €/Jahr.

**KfW 359** (moderat verbilligter Zins): Alle Eigentümer inkl. Vermieter, WEG, Unternehmen.

**Voraussetzungen:** Setzt bewilligten Zuschuss (KfW 458 oder BAFA BEG EM) voraus. Antrag innerhalb von 12 Monaten nach Zuschuss-Bescheid.
    `.trim(),
    href: 'https://www.kfw.de/358',
    benefits: {
      type: 'upTo',
      value: 120000,
      unit: '€',
      for: 'Kreditbetrag',
    },
  },
  {
    title: 'BEG Einzelmaßnahmen – Zuschuss (BAFA)',
    content: `
Direktzuschuss für einzelne energetische Maßnahmen ohne Effizienzhaus-Ziel.

**Förderfähige Maßnahmen:**
Gebäudehülle: Außenwanddämmung, Dachdämmung, OGD, Kellerdecke, Fenster/Türen (U ≤ 0,95 W/m²K), Sonnenschutz.
Anlagentechnik: Lüftungsanlage mit WRG, Gebäudeautomation (Klasse B).
Heizungsoptimierung: Hydraulischer Abgleich, Pumpentausch, Rohrdämmung.

**Zuschuss:** 15 % Grundförderung + 5 % iSFP-Bonus (bei Maßnahme aus individuellem Sanierungsfahrplan).

**Technische Mindest-U-Werte:** Außenwand ≤ 0,20 W/m²K | Dach ≤ 0,14 W/m²K | Fenster ≤ 0,95 W/m²K.

**Voraussetzungen:** Bestandsgebäude mindestens 5 Jahre alt. Antrag vor Auftragsvergabe. Kombinierbar mit KfW 358/359. Nicht kombinierbar mit §35c EStG für dieselbe Maßnahme.
    `.trim(),
    href: 'https://www.bafa.de/DE/Energie/Effiziente_Gebaeude/Sanierung_Wohngebaeude',
    benefits: {
      type: 'upTo',
      value: 12000,
      unit: '€',
      for: 'pro Wohneinheit (mit iSFP-Bonus)',
    },
  },
  {
    title: 'Steuerermäßigung energetische Sanierung (§35c EStG)',
    content: `
Direkte Minderung der Einkommensteuer für energetische Sanierungsmaßnahmen an selbstgenutztem Wohneigentum – kein separater Antrag, Geltendmachung über die Steuererklärung.

**Steuerbonus:** 20 % der Sanierungskosten verteilt auf 3 Jahre:
Jahr 1 + 2: je 7 % (max. 14.000 €/Jahr)
Jahr 3: 6 % (max. 12.000 €)

Förderfähige Maßnahmen: Dämmung, Fenster/Türen, Lüftung, Heizungserneuerung, Gebäudeautomation (nicht: PV-Anlage, Batteriespeicher).

**Voraussetzungen:** Nur Eigennutzer. Gebäude bei Maßnahmenbeginn mindestens 10 Jahre alt. Ausführung durch zertifiziertes Fachunternehmen + BMF-Bescheinigung. Maßnahme bis 31.12.2029 abgeschlossen. Nicht kombinierbar mit BEG WG oder BEG EM für dieselbe Maßnahme.
    `.trim(),
    href: 'https://www.bundesfinanzministerium.de',
    benefits: {
      type: 'upTo',
      value: 40000,
      unit: '€',
      for: 'pro Objekt (auf Basis von max. 200.000 € Kosten)',
    },
  },
  {
    title: 'Energieberatung Wohngebäude inkl. iSFP (BAFA)',
    content: `
Zuschuss für Vor-Ort-Energieberatung und Erstellung eines individuellen Sanierungsfahrplans (iSFP).

**Zuschusshöhe (50 % der Beratungskosten):**
Ein-/Zweifamilienhaus: max. 650 €
Gebäude ≥ 3 Wohneinheiten: max. 850 €
Zusatz bei WEG-Präsentation: +250 €

**Strategischer Vorteil:** Ein erstellter iSFP aktiviert den +5 %-iSFP-Bonus bei allen nachfolgenden BEG-EM-Maßnahmen innerhalb von 15 Jahren.

**Voraussetzungen:** Durchführung durch zugelassenen Energieberater (dena-/BfEE-Expertenliste). Förderzeitraum bis 31.12.2026.
    `.trim(),
    href: 'https://www.bafa.de/DE/Energie/Energieberatung/Energieberatung_Wohngebaeude',
    benefits: {
      type: 'upTo',
      value: 1100,
      unit: '€',
      for: 'inkl. WEG-Präsentationszuschlag',
    },
  },
  {
    title: 'Bayerisches Modernisierungsprogramm (BayModR)',
    content: `
Zinsgünstiges Darlehen und Zuschuss für Modernisierungsmaßnahmen an Mietwohngebäuden. Antrag bei BayernLabo / Regierung Oberpfalz.

**Zuschuss:** bis zu 500 €/m² Wohnfläche
Basiszuschuss: bis 300 €/m² | Nachhaltigkeitszuschuss: bis weitere 200 €/m²
Max. Zuschuss: 25 % des bewilligten Darlehens.

Darlehen: bis zu 100 % der förderfähigen Kosten (Mindestkosten 5.000 €/WE).

Förderfähige Maßnahmen: Energetische Sanierung, Barrierefreiheit, Sanitärinstallationen, Erneuerbare Energien u. v. m.

**Voraussetzungen:** Nur Vermieter (mind. 3 Mietwohnungen im Gebäude). Gebäude mindestens 15 Jahre alt (5 Jahre bei Kombination mit BEG). Belegungsbindung 10 Jahre nach Fertigstellung. Antrag vor Maßnahmenbeginn. Kombinierbar mit BEG WG und BEG EM.
    `.trim(),
    href: 'https://www.bayernlabo.de/mietwohnraum/bayerisches-modernisierungsprogramm',
    benefits: {
      type: 'upTo',
      value: 500,
      unit: '€',
      for: 'pro m² Wohnfläche',
    },
  },
  {
    title: 'Regensburg effizient – Sanierung (nachwachsende Rohstoffe)',
    content: `
Städtischer Zuschuss der Stadt Regensburg für Gebäudehüllensanierung ausschließlich mit nachwachsenden Rohstoffen.

**Fördersätze:**
Ökologische Wärmedämmung: 15 €/m² gedämmter Fläche
Holzfenster / Holzaußentüren: 20 €/m² Bauteilfläche
Holz-Aluminium-Fenster/-Türen: 15 €/m² Bauteilfläche

**Voraussetzungen:** Bestandsgebäude mindestens 5 Jahre alt, max. 10 Wohneinheiten. Max. 2 verschiedene Maßnahmen je Liegenschaft. Antrag vor Maßnahmenbeginn bei der Stadt Regensburg. Kombinierbar mit BEG EM (BAFA).

Kontakt: klimaschutz@regensburg.de | Tel. 0941/507-3022
    `.trim(),
    href: 'https://www.regensburg.de/greendeal/mitmachen/staedtische-foerderungen-zum-klimaschutz',
    benefits: {
      type: 'upTo',
      value: 10000,
      unit: '€',
      for: 'pro Liegenschaft',
    },
  },
  {
    title: 'Regensburg effizient – Photovoltaik',
    content: `
Städtischer Zuschuss der Stadt Regensburg für neu installierte PV-Anlagen.

**Fördersätze:**
Standard (Dach): 100 €/kWp, max. 1.500 €
Denkmalgeschütztes Gebäude oder Fassadeninstallation: 200 €/kWp

**Voraussetzungen:** Antrag vor Kauf/Installationsbeginn. Eine Förderung je Gebäude. Antragsberechtigt: Privatpersonen, Unternehmen, WEGs.
    `.trim(),
    href: 'https://www.regensburg.de/greendeal/mitmachen/staedtische-foerderungen-zum-klimaschutz',
    benefits: {
      type: 'upTo',
      value: 1500,
      unit: '€',
      for: 'pro Gebäude',
    },
  },
  {
    title: 'Regensburg resilient – Gebäudebegrünung',
    content: `
Städtischer Zuschuss der Stadt Regensburg für Dach- und Fassadenbegrünung sowie Entsiegelungsmaßnahmen (Klimaanpassung: Hitzeschutz, Regenwasser).

**Voraussetzungen:** Antrag vor Maßnahmenbeginn. Maßnahme an bestehendem Gebäude. Programm läuft bis 31.12.2026.
    `.trim(),
    href: 'https://www.regensburg.de/greendeal/mitmachen/staedtische-foerderungen-zum-klimaschutz',
    benefits: {
      type: 'upTo',
      value: 4000,
      unit: '€',
      for: 'pro Maßnahme / Liegenschaft',
    },
  },
  {
    title: 'REWAG – Förderung Photovoltaik',
    content: `
Zuschuss der REWAG (Stadtwerk Regensburg) aus dem Grüner-Strom-Label-Fonds.

**Fördersätze:**
PV-Anlage (Dach/Fassade): bis 400 €
Balkonkraftwerk / Mini-PV: 50 €
Post-EEG-Anlagen bis 5,5 kWp: bis 240 €

**Voraussetzungen:** Aktiver Energieliefervertrag mit REWAG erforderlich (Tarif rewario.strom.natur.regio oder rewario.strom.mobil). Gebäude im Versorgungsgebiet Regensburg. Kombinierbar mit Regensburg effizient – Photovoltaik.
    `.trim(),
    href: 'https://www.rewag.de/foerderungen',
    benefits: {
      type: 'upTo',
      value: 400,
      unit: '€',
      for: 'pro PV-Anlage',
    },
  },
];
