import "i18next";
import { defaultNs, resources } from "/src/i18next/i18n.ts";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNs;
    resources: typeof resources['vi']
  }
}