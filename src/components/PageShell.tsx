import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const nav = [
  "Home",
  "About Us",
  "Events",
  "Membership",
  "Sponsors",
  "Gallery",
  "Awards And Recognition",
];

export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header nav={nav} />
      {children}
      <Footer />
    </>
  );
}
