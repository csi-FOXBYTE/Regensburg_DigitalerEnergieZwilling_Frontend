// src/@types/i18next.d.ts
import 'i18next';
import common from '../public/locales/de/common.json';
import energyCalculation from '../public/locales/de/energyCalculation.json';
import landingPage from '../public/locales/de/landingPage.json';
import map from '../public/locales/de/map.json';
import methodology from '../public/locales/de/methodology.json';
import municipality from '../public/locales/de/municipality.json';
import progressBar from '../public/locales/de/progressBar.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof common;
      energyCalculation: typeof energyCalculation;
      progressBar: typeof progressBar;
      landingPage: typeof landingPage;
      map: typeof map;
      methodology: typeof methodology;
      municipality: typeof municipality;
    };
  }
}
