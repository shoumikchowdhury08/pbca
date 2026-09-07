import { ArrowUpRight } from "lucide-react";
import InteriorPage from "@/components/InteriorPage";
import Carousel from "@/components/ui/carousel";
import InteractiveImageBentoGallery from "@/components/ui/InteractiveImageBentoGallery";

const events = [
  {
    id: "durga-puja",
    tag: "The main event",
    title: "Durga Puja & Dusshera",
    text: "Five days of worship, music, food and the kind of togetherness that stays with you long after visarjan.",
  },
  {
    id: "dhak-dhunuchi",
    tag: "Music & movement",
    title: "Dhaak & Dhunuchi",
    text: "Feel the pulse of the puja through drumming, dance and a whole lot of joy.",
  },
  {
    id: "cultural-evenings",
    tag: "On stage",
    title: "Cultural evenings",
    text: "Local talent, familiar songs and new voices sharing one stage.",
  },
  {
    id: "food-adda",
    tag: "At the table",
    title: "Food & adda",
    text: "Come hungry for the flavours of Bengal and stay for the conversation.",
  },
];

// const slideData = [
//   {
//     title: "Mystic Mountains",
//     // button: "Explore Component",
//     src: "https://images.unsplash.com/photo-1494806812796-244fe51b774d?q=80&w=3534&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   },
//   {
//     title: "Urban Dreams",
//     // button: "Explore Component",
//     src: "https://images.unsplash.com/photo-1518710843675-2540dd79065c?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   },
//   {
//     title: "Neon Nights",
//     // button: "Explore Component",
//     src: "https://images.unsplash.com/photo-1590041794748-2d8eb73a571c?q=80&w=3456&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   },
//   {
//     title: "Desert Whispers",
//     // button: "Explore Component",
//     src: "https://images.unsplash.com/photo-1679420437432-80cfbf88986c?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   },
// ];

const imageItems = [
  {
    id: 1,
    title: "Mountain Vista",
    desc: "Serenity above the clouds.",
    url: "https://cdn.21st.dev/assets/mirror/61/611dfffb9431b3ac4206a6e7a8874496747263ce8535985238d0557503e7dd48.jpg",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    id: 2,
    title: "Coastal Arch",
    desc: "Where the land meets the sea.",
    url: "https://cdn.21st.dev/assets/mirror/97/97103cb7b8ac5adbbd3e64c7410560b04a83b056daa580ee1b0353f774ec8d3d.jpg",
    span: "md:row-span-1",
  },
  {
    id: 3,
    title: "Forest Canopy",
    desc: "Sunlight filtering through leaves.",
    url: "https://cdn.21st.dev/assets/mirror/e5/e568c4b96c7f3aee720ea6b72026a629c5122bf9a7d887d62ab193f349eb5bfe.jpg",
    span: "md:row-span-1",
  },
  {
    id: 4,
    title: "Desert Dunes",
    desc: "Golden sands under the sun.",
    url: "https://cdn.21st.dev/assets/mirror/d5/d505ed9bd1290a57ed0a97d1405d5f045332ac4b3bdca717e1fb2adbd07e6af1.jpg",
    span: "md:row-span-2",
  },
  {
    id: 5,
    title: "City at Night",
    desc: "A vibrant urban landscape.",
    url: "https://cdn.21st.dev/assets/mirror/6a/6a375b80a961a5dfa61d0e0b3edaa47dbf6267189e2fe93ca27eb12e5ec1f5ce.jpg",
    span: "md:row-span-1",
  },
  {
    id: 6,
    title: "Misty Lake",
    desc: "Morning fog over calm waters.",
    url: "https://cdn.21st.dev/assets/mirror/81/81f20f0ed8b6b081f4b8b4da2370e787a1aaa878bdb371a004b6339f6dd70d81.jpg",
    span: "md:col-span-2 md:row-span-1",
  },
];

export default function EventsPage() {
  return (
    <InteriorPage
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
        <InteractiveImageBentoGallery
          imageItems={imageItems}
          title="Curated Moments"
          description="A collection of stunning landscapes. Drag to explore, click to expand."
        />
      </div>

      {/* <div className="relative overflow-hidden w-full h-full py-20">
        <Carousel slides={slideData} />
      </div> */}
      <div className="events-list">
        {events.map((event, index) => (
          <article id={event.id} key={event.id}>
            <span>
              0{index + 1} / {event.tag}
            </span>
            <div>
              <h2>{event.title}</h2>
              <p>{event.text}</p>
              <a className="text-link" href="#contact">
                Plan your visit <ArrowUpRight size={16} />
              </a>
            </div>
          </article>
        ))}
      </div>
    </InteriorPage>
  );
}
