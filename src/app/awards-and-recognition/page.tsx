import { Award, Star, Trophy } from "lucide-react";
import InteriorPage from "@/components/InteriorPage";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

const recognitions = [
  {
    year: "2024",
    title: "Community Celebration Award",
    text: "Recognised for creating an open, welcoming cultural space in East Bangalore.",
  },
  {
    year: "2022",
    title: "Best Cultural Initiative",
    text: "Honouring the volunteers behind our inclusive year-round programming.",
  },
  {
    year: "2019",
    title: "23rd year milestone",
    text: "Celebrating the people and partnerships that keep the PBCA spirit alive.",
  },
];

const DummyContent = () => {
  return (
    <>
      {[...new Array(3).fill(1)].map((_, index) => {
        return (
          <div
            key={"dummy-content" + index}
            className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4"
          >
            <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
              <span className="font-bold text-neutral-700 dark:text-neutral-200">
                The first rule of Apple club is that you boast about Apple club.
              </span>{" "}
              Keep a journal, quickly jot down a grocery list, and take amazing
              class notes. Want to convert those notes to text? No problem.
              Langotiya jeetu ka mara hua yaar is ready to capture every
              thought.
            </p>
            <img
              src="https://assets.aceternity.com/macbook.png"
              alt="Macbook mockup from Aceternity UI"
              height="500"
              width="500"
              className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain"
            />
          </div>
        );
      })}
    </>
  );
};

const data = [
  {
    category: "Artificial Intelligence",
    title: "You can do more with AI.",
    src: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=3556&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "Productivity",
    title: "Enhance your productivity.",
    src: "https://images.unsplash.com/photo-1531554694128-c4c6665f59c2?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "Product",
    title: "Launching the new Apple Vision Pro.",
    src: "https://images.unsplash.com/photo-1713869791518-a770879e60dc?q=80&w=2333&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },

  {
    category: "Product",
    title: "Maps for your iPhone 15 Pro Max.",
    src: "https://images.unsplash.com/photo-1599202860130-f600f4948364?q=80&w=2515&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "iOS",
    title: "Photography just got better.",
    src: "https://images.unsplash.com/photo-1602081957921-9137a5d6eaee?q=80&w=2793&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "Hiring",
    title: "Hiring for a Staff Software Engineer",
    src: "https://images.unsplash.com/photo-1511984804822-e16ba72f5848?q=80&w=2048&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
];

export default function AwardsPage() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <InteriorPage
      pageSlug="awards-and-recognition"
      // eyebrow="03 / AWARDS & RECOGNITION"
      title={
        <>
          A legacy
          <br />
          <i>worth celebrating.</i>
        </>
      }
      intro="Every recognition belongs to the volunteers, artists, families and partners who make PBCA possible."
      image="https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1800&q=85"
    >
      <div className="interior-copy-grid">
        <div>
          <p className="eyebrow">Milestones</p>
          <h2>Good work leaves a mark.</h2>
        </div>
        <div>
          <p>
            From community honours to cultural milestones, these moments reflect
            the care behind the scenes. They remind us that a celebration is
            measured by the people it brings closer.
          </p>
        </div>
      </div>
      <div className="recognition-list">
        {recognitions.map(({ year, title, text }, index) => {
          const Icon = [Award, Star, Trophy][index];
          return (
            <article key={year}>
              <Icon size={25} />
              <span>{year}</span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          );
        })}
      </div>

      <div className="w-full h-full py-20">
        {/* <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
          Awards Gallery.
        </h2> */}
        <Carousel items={cards} />
      </div>
    </InteriorPage>
  );
}
