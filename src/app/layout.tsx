import type { Metadata } from "next";
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
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "DBT Skills Reference",
    description: "Fast, search-first DBT skills reference for virtual group therapy.",
    type: "website",
  },
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
