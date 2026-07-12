import type { Metadata, Viewport } from "next";
import { Inter, Poppins, Lora, Nunito, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemePresetApplier } from "@/components/dbt/theme-preset-applier";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
        {/* Capture beforeinstallprompt as early as possible — before React loads.
            Stored on window so the InstallAppButton component can access it whenever it mounts. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.__deferredPrompt = null;
              window.addEventListener('beforeinstallprompt', function(e) {
                e.preventDefault();
                window.__deferredPrompt = e;
                // Dispatch a custom event so React components know it's ready
                window.dispatchEvent(new CustomEvent('pwa-install-available'));
              });
              window.addEventListener('appinstalled', function() {
                window.__deferredPrompt = null;
                window.__deferredStandalone = true;
                window.dispatchEvent(new CustomEvent('pwa-installed'));
              });
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${poppins.variable} ${lora.variable} ${nunito.variable} ${sourceSans.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ThemePresetApplier />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
