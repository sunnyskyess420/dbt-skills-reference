import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DBT Skills Reference",
  description:
    "Fast, search-first DBT skills reference for use during virtual group therapy. Covers all five DBT modules: General, Mindfulness, Interpersonal Effectiveness, Emotion Regulation, Distress Tolerance.",
  keywords: [
    "DBT",
    "Dialectical Behavior Therapy",
    "Marsha Linehan",
    "skills training",
    "mindfulness",
    "distress tolerance",
    "emotion regulation",
    "interpersonal effectiveness",
    "therapy reference",
  ],
  authors: [{ name: "DBT Skills Reference" }],
  applicationName: "DBT Skills Reference",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "DBT Skills",
  },
  openGraph: {
    title: "DBT Skills Reference",
    description: "Fast, search-first DBT skills reference for virtual group therapy.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "DBT Skills Reference",
    description: "Fast, search-first DBT skills reference for virtual group therapy.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
