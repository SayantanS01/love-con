import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import HeartParticles from "@/components/HeartParticles";

export const metadata: Metadata = {
  title: "Our Shared Sanctuary",
  description: "A private, intimate digital journal for our shared memories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider>
          <HeartParticles />
          {/* Main content wrapper with global max-width to protect from edges */}
          <main className="flex-1 w-full max-w-screen-2xl mx-auto">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
