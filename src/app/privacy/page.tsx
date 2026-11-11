import type { Metadata } from "next";
import { privacyPage as t } from "@/content/site";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: t.title,
  description: t.metaDescription,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return <LegalPage title={t.title} updated={t.updated} sections={t.sections} />;
}
