import type { Metadata } from "next";
import { accessibilityPage as t } from "@/content/site";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: t.title,
  description: t.metaDescription,
  alternates: { canonical: "/accessibility" },
};

export default function AccessibilityPage() {
  return <LegalPage title={t.title} updated={t.updated} sections={t.sections} />;
}
