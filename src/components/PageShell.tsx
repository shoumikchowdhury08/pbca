import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const nav = ["Home", "About Us", "Membership", "Awards And Recognition", "Events"];

export default function PageShell({ children }: { children: React.ReactNode }) {
  return <>
  <Header nav={nav} />
  {children}
  <Footer nav={nav} /></>;
}