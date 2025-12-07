import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#10b981",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://rams.ictusflow.com"),
  title: {
    default: "RAMS Builder | AI-Powered Risk Assessment Method Statements for UK Construction",
    template: "%s | RAMS Builder",
  },
  description:
    "Create professional RAMS documents in minutes. AI-powered Risk Assessment Method Statements compliant with HSE, CDM 2015, BS 7671, and ISO 45001. Built for UK electrical contractors and construction professionals.",
  keywords: [
    "RAMS",
    "Risk Assessment Method Statement",
    "RAMS builder",
    "RAMS software",
    "construction safety documents",
    "HSE compliant RAMS",
    "CDM 2015",
    "ISO 45001",
    "electrical contractor RAMS",
    "UK construction safety",
    "method statement generator",
    "risk assessment software",
    "safe isolation procedure",
    "electrical installation RAMS",
    "BS 7671",
    "Electricity at Work Regulations",
    "construction documentation",
    "health and safety documents",
    "RAMS template UK",
    "contractor safety documents",
  ],
  authors: [{ name: "Ictus Flow", url: "https://ictusflow.com" }],
  creator: "Ictus Flow",
  publisher: "Ictus Flow",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://rams.ictusflow.com",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://rams.ictusflow.com",
    siteName: "RAMS Builder",
    title: "RAMS Builder | AI-Powered Risk Assessment Method Statements",
    description:
      "Create professional, HSE-compliant RAMS documents in minutes. AI-powered generation for UK electrical contractors and construction professionals.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "RAMS Builder - AI-Powered Risk Assessment Method Statements",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RAMS Builder | AI-Powered RAMS for UK Construction",
    description:
      "Create professional, HSE-compliant RAMS documents in minutes. Built for UK electrical contractors.",
    images: ["/og-image.png"],
    creator: "@ictusflow",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add these once you have them
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
  category: "technology",
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://rams.ictusflow.com/#application",
      name: "RAMS Builder",
      description:
        "AI-powered Risk Assessment Method Statement builder for UK construction professionals",
      url: "https://rams.ictusflow.com",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web Browser",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "GBP",
        description: "Free tier with 2 RAMS per month",
      },
      creator: {
        "@type": "Organization",
        name: "Ictus Flow",
        url: "https://ictusflow.com",
      },
      featureList: [
        "AI-powered RAMS generation",
        "HSE and CDM 2015 compliance",
        "5x5 Risk Assessment Matrix",
        "Safe Isolation Procedures",
        "Word document export",
        "Version history and tracking",
      ],
    },
    {
      "@type": "Organization",
      "@id": "https://ictusflow.com/#organization",
      name: "Ictus Flow",
      url: "https://ictusflow.com",
      logo: {
        "@type": "ImageObject",
        url: "https://rams.ictusflow.com/logo.png",
      },
      sameAs: [],
      contactPoint: {
        "@type": "ContactPoint",
        email: "support@ictusflow.com",
        contactType: "customer service",
        areaServed: "GB",
        availableLanguage: "English",
      },
    },
    {
      "@type": "SoftwareApplication",
      name: "RAMS Builder",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        ratingCount: "50",
        bestRating: "5",
        worstRating: "1",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is a RAMS document?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A RAMS (Risk Assessment Method Statement) is a document that combines a risk assessment with a method statement. It identifies hazards, assesses risks, and outlines safe working procedures for construction activities. RAMS are required by UK health and safety regulations including CDM 2015.",
          },
        },
        {
          "@type": "Question",
          name: "Is RAMS Builder compliant with UK regulations?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, RAMS Builder generates documents compliant with HSE guidelines, CDM 2015 (Construction Design and Management Regulations), BS 7671 (IET Wiring Regulations), ISO 45001, and the Electricity at Work Regulations 1989.",
          },
        },
        {
          "@type": "Question",
          name: "How does the AI generate RAMS content?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "RAMS Builder uses Claude AI to generate comprehensive method statements, hazard assessments, and control measures based on your project details. The AI is trained on UK construction safety standards and best practices.",
          },
        },
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://rams.ictusflow.com",
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
