import { brand, meta } from "@/content/site";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? brand.siteUrl;

/**
 * Structured data for search engines (schema.org JSON-LD): the student team as an Organization,
 * and the glasses as a Product. No price or availability: it is a prototype, not for sale.
 */
export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: brand.name,
        alternateName: "ATP Group 14 (SE-14)",
        url: `${siteUrl}/`,
        logo: `${siteUrl}/icon.svg`,
        description: "Student team at the Informatics Institute of Technology (IIT), Sri Lanka, affiliated with the University of Westminster.",
        ...(brand.contactEmail ? { email: brand.contactEmail } : {}),
      },
      {
        "@type": "Product",
        "@id": `${siteUrl}/#product`,
        name: `${brand.name} haptic glasses`,
        description: meta.description,
        image: `${siteUrl}/opengraph-image`,
        brand: { "@id": `${siteUrl}/#organization` },
        manufacturer: { "@id": `${siteUrl}/#organization` },
        category: "Assistive technology prototype",
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      // escape "<" so the JSON can never close the script tag
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
