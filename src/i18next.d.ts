// src/@types/i18next.d.ts
import "i18next";
import common from "../public/locales/de/common.json";
import progressBar from "../public/locales/de/progressBar.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "common";
    resources: {
      common: typeof common;
      progressBar: typeof progressBar;
    };
  }
}