import certificatesJson from "./certificates.json";

/**
 * Certificate entries for the scrollable certificates section.
 */
export type Certificate = {
  id: string;
  title: string;
  titleBn?: string;
  organization: string;
  organizationBn?: string;
  date: string;
  imageSrc: string;
  imageAlt: string;
  /** Optional full-size certificate image URL for zoom/fullscreen view */
  fullImageSrc?: string;
  /** Optional certificate verification URL */
  verificationUrl?: string;
};

/** Ensures newer fields exist when loading from older JSON or localStorage. */
export function normalizeCertificate(
  c: Partial<Certificate> & Pick<Certificate, "id">
): Certificate {
  return {
    id: c.id,
    title: c.title ?? "",
    titleBn: c.titleBn,
    organization: c.organization ?? "",
    organizationBn: c.organizationBn,
    date: c.date ?? "",
    imageSrc: c.imageSrc ?? "/placeholder-certificate.svg",
    imageAlt: c.imageAlt ?? "",
    fullImageSrc: c.fullImageSrc,
    verificationUrl: c.verificationUrl,
  };
}

export const certificates: Certificate[] = (
  certificatesJson as Certificate[]
).map((cert) => normalizeCertificate(cert));
