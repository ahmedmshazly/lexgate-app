import { isSupportedLocale } from "@lexgate/localization";
import { notFound } from "next/navigation";

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) notFound();

  return <div className="locale-root">{children}</div>;
}
