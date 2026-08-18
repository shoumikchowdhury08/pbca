import { ArrowUpRight } from "lucide-react";
import InteriorPage from "@/components/InteriorPage";

const events = [{ id: "durga-puja", tag: "The main event", title: "Durga Puja & Dusshera", text: "Five days of worship, music, food and the kind of togetherness that stays with you long after visarjan." }, { id: "dhak-dhunuchi", tag: "Music & movement", title: "Dhaak & Dhunuchi", text: "Feel the pulse of the puja through drumming, dance and a whole lot of joy." }, { id: "cultural-evenings", tag: "On stage", title: "Cultural evenings", text: "Local talent, familiar songs and new voices sharing one stage." }, { id: "food-adda", tag: "At the table", title: "Food & adda", text: "Come hungry for the flavours of Bengal and stay for the conversation." }];

export default function EventsPage() {
  return <InteriorPage eyebrow="04 / EVENTS" title={<>There is always<br /><i>something on.</i></>} intro="A year-round calendar of culture, community and the rituals that bring us back together." image="https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=1800&q=85">
    <div className="events-list">{events.map((event, index) => <article id={event.id} key={event.id}><span>0{index + 1} / {event.tag}</span><div><h2>{event.title}</h2><p>{event.text}</p><a className="text-link" href="#contact">Plan your visit <ArrowUpRight size={16} /></a></div></article>)}</div>
  </InteriorPage>;
}
