import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PBCA | Bengali Culture in East Bangalore",
  description: "PBCA celebrates Durga Puja, Dusshera and Bengali culture with the East Bangalore community.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
