import { Award, Star, Trophy } from "lucide-react";
import InteriorPage from "@/components/InteriorPage";

const recognitions = [{ year: "2024", title: "Community Celebration Award", text: "Recognised for creating an open, welcoming cultural space in East Bangalore." }, { year: "2022", title: "Best Cultural Initiative", text: "Honouring the volunteers behind our inclusive year-round programming." }, { year: "2019", title: "23rd year milestone", text: "Celebrating the people and partnerships that keep the PBCA spirit alive." }];

export default function AwardsPage() {
  return <InteriorPage eyebrow="03 / AWARDS & RECOGNITION" title={<>A legacy<br /><i>worth celebrating.</i></>} intro="Every recognition belongs to the volunteers, artists, families and partners who make PBCA possible." image="https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1800&q=85">
    <div className="interior-copy-grid"><div><p className="eyebrow">Milestones</p><h2>Good work leaves a mark.</h2></div><div><p>From community honours to cultural milestones, these moments reflect the care behind the scenes. They remind us that a celebration is measured by the people it brings closer.</p></div></div>
    <div className="recognition-list">{recognitions.map(({ year, title, text }, index) => { const Icon = [Award, Star, Trophy][index]; return <article key={year}><Icon size={25} /><span>{year}</span><div><h3>{title}</h3><p>{text}</p></div></article>; })}</div>
  </InteriorPage>;
}
