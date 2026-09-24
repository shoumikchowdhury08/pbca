import { ArrowUpRight } from "lucide-react";
import InteriorPage from "@/components/InteriorPage";
import EventsGallery from "@/components/EventsGallery";
import EventSchedule from "@/components/EventSchedule";

export default function EventsPage() {
  return (
    <InteriorPage
      pageSlug="events"
      // eyebrow="04 / EVENTS"
      title={
        <>
          There is always
          <br />
          <i>something on.</i>
        </>
      }
      intro="A year-round calendar of culture, community and the rituals that bring us back together."
      image="https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=1800&q=85"
    >
      <div className="w-full antialiased">
        <EventsGallery />
      </div>

      <EventSchedule />
    </InteriorPage>
  );
}
