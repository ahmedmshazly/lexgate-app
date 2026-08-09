import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lex Gate",
  description: "Lex Gate legal practice platform foundation",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const requestHeaders = await headers();
  const locale = requestHeaders.get("x-lexgate-locale") === "ar" ? "ar" : "en";
  const isArabic = locale === "ar";

  return (
    <html
      lang={isArabic ? "ar-EG" : "en"}
      dir={isArabic ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}
