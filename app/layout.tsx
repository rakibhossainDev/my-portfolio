/**
 * Root layout: Poppins (EN), Hind Siliguri when BN via `html.locale-bn` + CSS variables,
 * ConditionalChrome hides marketing chrome on `/admin`.
 */
import type { Metadata, Viewport } from "next";
import { Hind_Siliguri, Poppins } from "next/font/google";
import { AppProviders } from "@/components/app-providers";
import { ConditionalChrome } from "@/components/conditional-chrome";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["latin", "bengali"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const defaultTitle = "MD RAKIB HOSSAIN — Flutter App Developer";
const defaultDescription =
  "MD RAKIB HOSSAIN is a Flutter app developer building high-performance iOS & Android experiences, with a blog on mobile craft and selected projects.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s | MD RAKIB HOSSAIN",
  },
  description: defaultDescription,
  keywords: [
    "Rakib Hossain",
    "Flutter",
    "Dart",
    "Bangladesh",
    "mobile developer",
    "iOS",
    "Android",
    "blog",
    "mobile apps",
  ],
  authors: [{ name: "MD RAKIB HOSSAIN", url: siteUrl }],
  creator: "MD RAKIB HOSSAIN",
  openGraph: {
    type: "website",
    locale: "en",
    url: siteUrl,
    siteName: "MD RAKIB HOSSAIN",
    title: defaultTitle,
    description: defaultDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f8fafc",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${hindSiliguri.variable} h-full`}>
      <body className="page-gradient flex min-h-full flex-col text-slate-900 antialiased">
        <AppProviders>
          <ConditionalChrome>{children}</ConditionalChrome>
        </AppProviders>
      </body>
    </html>
  );
}
