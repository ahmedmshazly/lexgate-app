export const supportedLocales = ["en", "ar"] as const;

export type SupportedLocale = (typeof supportedLocales)[number];

export const isSupportedLocale = (value: string): value is SupportedLocale =>
  supportedLocales.includes(value as SupportedLocale);

export const localeMetadata = (locale: SupportedLocale) =>
  locale === "ar"
    ? { language: "ar-EG", direction: "rtl" as const }
    : { language: "en", direction: "ltr" as const };
