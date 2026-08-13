import type { Metadata } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Personal portfolio and AI services portal",
};

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/experience", label: "Experience" },
  { href: "/services", label: "Services" },
  { href: "/ai-work", label: "AI Work" },
  { href: "/contact", label: "Contact" },
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} ${inter.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-base font-body text-text antialiased">
        <header className="sticky top-0 z-50 border-b border-panel-border/60 bg-base/80 backdrop-blur">
          <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
            <Link
              href="/"
              className="font-display text-sm font-medium tracking-[0.2em] text-text uppercase"
            >
              Raghu Akula
            </Link>
            <ul className="flex gap-8 text-sm text-text-muted">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-text"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </header>
        <main className="flex flex-1 flex-col">{children}</main>
        <footer className="border-t border-panel-border/60 px-6 py-8 text-center text-xs text-text-muted">
          © {new Date().getFullYear()} Raghu Akula
        </footer>
      </body>
    </html>
  );
}
