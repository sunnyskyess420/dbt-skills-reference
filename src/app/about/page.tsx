import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About & sources",
  description:
    "What DBT Skills Reference is, where the content comes from, who it is not affiliated with, and its limits.",
};

const ISSUES_URL = "https://github.com/sunnyskyess420/dbt-skills-reference/issues";

export default function AboutPage() {
  return (
    <main
      id="main-content"
      className="mx-auto max-w-2xl px-5 py-10 sm:py-14 text-foreground"
    >
      <Link
        href="/"
        className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4"
      >
        ← Back to DBT Skills Reference
      </Link>

      <h1 className="mt-6 text-3xl font-semibold tracking-tight">
        About &amp; sources
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        This page explains what this reference is, where its content comes from,
        and what it is not.
      </p>

      <section className="mt-8">
        <h2 className="text-lg font-medium">What this is</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          A fast, search-first reference to DBT skills, with fillable digital
          worksheets, built to be used alongside — not instead of — a
          therapist-led DBT skills group. Everything runs in your browser;
          entries are saved on your own device and, if you choose to sign in,
          backed up to your account.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-medium">Where the content comes from</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          The skills summaries and worksheet structures here are educational
          paraphrases based on:
        </p>
        <blockquote className="mt-3 border-l-2 pl-4 text-sm leading-relaxed">
          Marsha M. Linehan,{" "}
          <cite className="not-italic">
            DBT Skills Training Handouts and Worksheets, Second Edition
          </cite>
          . Guilford Press, 2014.
        </blockquote>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Handout and worksheet numbers (for example{" "}
          <span className="font-mono">Distress Tolerance Worksheet 6</span>) and
          printed page numbers refer to that book, so you can find the original
          material for printing or personal use. The exact wording of the
          handouts and worksheets is{" "}
          <strong className="font-medium text-foreground">not</strong>{" "}
          reproduced here; the aim is orientation and practice support.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          The official workbook is the authoritative source and the best thing
          to own. You can get it from Guilford Press or any bookseller:
        </p>
        <ul className="mt-3 space-y-1 text-sm">
          <li>
            <a
              className="underline underline-offset-4 hover:text-foreground text-muted-foreground"
              href="https://www.guilford.com/books/DBT-Skills-Training-Handouts-and-Worksheets/Marsha-Linehan/9781462516995"
              target="_blank"
              rel="noreferrer noopener"
            >
              Buy “DBT Skills Training Handouts and Worksheets” (Guilford Press)
            </a>
          </li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-medium">Not affiliated or endorsed</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          This is an independent, unaffiliated project. It is not produced,
          sponsored, reviewed, or endorsed by Marsha M. Linehan, Behavioral Tech
          / Behavioral Tech Institute, or Guilford Press.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-medium">Not medical advice</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          This is an educational tool, not a substitute for assessment, diagnosis,
          or treatment by a qualified clinician. Do not use it to make decisions
          about medication or care. If you are in crisis or thinking about harming
          yourself, contact your local emergency services or a crisis line
          immediately — in the US you can call or text{" "}
          <span className="font-mono">988</span> (Suicide &amp; Crisis Lifeline).
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-medium">Rights holders &amp; takedowns</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          If you hold rights in any material referenced here and believe it is
          being used inappropriately, please open an issue and it will be
          reviewed and corrected or removed promptly:
        </p>
        <ul className="mt-3 space-y-1 text-sm">
          <li>
            <a
              className="underline underline-offset-4 hover:text-foreground text-muted-foreground"
              href={ISSUES_URL}
              target="_blank"
              rel="noreferrer noopener"
            >
              Open an issue on GitHub
            </a>
          </li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-medium">The software</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          This is an independent educational project shared for others running or
          attending skills groups. It is not a commercial product.
        </p>
      </section>

      <div className="mt-10 border-t pt-4 text-xs text-muted-foreground">
        Last reviewed: {new Date().toISOString().slice(0, 10)}
      </div>
    </main>
  );
}
