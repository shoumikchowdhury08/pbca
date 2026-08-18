import { Users, HeartHandshake, CalendarCheck } from "lucide-react";
import InteriorPage from "@/components/InteriorPage";

const benefits = [{ icon: Users, title: "A wider circle", text: "Meet families, artists, volunteers and friends who make PBCA feel like home." }, { icon: HeartHandshake, title: "A way to contribute", text: "Support the traditions and community programmes that matter to all of us." }, { icon: CalendarCheck, title: "A year of belonging", text: "Join gatherings, workshops and celebrations beyond the five days of puja." }];

export default function MembershipPage() {
  return <InteriorPage eyebrow="02 / MEMBERSHIP" title={<>Belong<br /><i>with us.</i></>} intro="Membership is an invitation to take part, show up and help shape the next chapter of PBCA." image="https://images.unsplash.com/photo-1567591414240-e9c1e59f3e06?auto=format&fit=crop&w=1800&q=85">
    <div className="interior-copy-grid"><div><p className="eyebrow">Why join?</p><h2>Bring your whole self to the celebration.</h2></div><div><p>Whether you have been here for decades or are discovering PBCA for the first time, membership gives you a place in the work and the joy of our community.</p><a className="submit-button" href="mailto:membership@pbca.org">Enquire about membership</a></div></div>
    <div className="benefit-grid">{benefits.map(({ icon: Icon, title, text }) => <article key={title}><Icon size={24} /><h3>{title}</h3><p>{text}</p></article>)}</div>
  </InteriorPage>;
}
