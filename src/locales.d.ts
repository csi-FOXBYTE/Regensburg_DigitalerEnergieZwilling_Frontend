import type locale from "../public/locales/en.json";

declare module "i18next" {
  interface CustomTypeOptions {
    resources: typeof locale
  }
}
