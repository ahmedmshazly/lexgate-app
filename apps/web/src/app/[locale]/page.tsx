import { isSupportedLocale } from "@lexgate/localization";
import { notFound } from "next/navigation";
import { PortalMark } from "../../components/portal-mark";

const copy = {
  en: {
    eyebrow: "Legal Practice Platform",
    heading: "A controlled foundation for trusted legal work.",
    body: "Lex Gate’s engineering environment is ready for carefully governed development. Client data, legal workflows, and public-service claims are not active in this foundation release.",
    status: "Milestone M0 · Foundation",
    confidentiality: "Internal engineering environment",
  },
  ar: {
    eyebrow: "منصة إدارة الممارسة القانونية",
    heading: "أساس منضبط لعمل قانوني موثوق.",
    body: "بيئة ليكس جيت الهندسية جاهزة لتطوير منضبط ومحكوم. لا توجد بيانات موكّلين أو إجراءات قانونية أو ادعاءات خدمات عامة فعّالة في هذه النسخة التأسيسية.",
    status: "المرحلة M0 · التأسيس",
    confidentiality: "بيئة هندسية داخلية",
  },
} as const;

export default async function LocalePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();

  const content = copy[locale];
  return (
    <main className="foundation-shell" aria-labelledby="foundation-heading">
      <header className="foundation-header">
        <a className="brand-lockup" href={`/${locale}`} aria-label="Lex Gate">
          <PortalMark />
          <span>Lex Gate</span>
        </a>
        <span className="classification" data-classification="internal">
          {content.confidentiality}
        </span>
      </header>
      <section className="foundation-content">
        <p className="eyebrow">{content.eyebrow}</p>
        <h1 id="foundation-heading">{content.heading}</h1>
        <p className="foundation-copy">{content.body}</p>
        <p className="foundation-status">{content.status}</p>
      </section>
    </main>
  );
}
