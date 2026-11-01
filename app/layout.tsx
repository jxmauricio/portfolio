import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { githubUrl, site } from "@/content";
import { themeScript } from "@/lib/theme";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} · ${site.role}`,
    template: `%s · ${site.name}`,
  },
  description: `${site.name} is a ${site.role.toLowerCase()} at ${site.company}, and the builder of Bankr, an AI-first personal finance app.`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Lets the scroll fade-ins hide content only when JS will reveal it. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        {/* Applies the saved (or system) theme before first paint, so there's no flash. */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Nav name={site.name} githubUrl={githubUrl()} linkedinUrl={site.linkedin} />
        <main>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
