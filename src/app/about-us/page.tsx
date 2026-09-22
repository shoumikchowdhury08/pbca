import InteriorPage from "@/components/InteriorPage";
import AboutUsGallery from "@/components/AboutUsGallery";

export default function AboutUsPage() {
  return (
    <InteriorPage
      pageSlug="about-us"
      title={
        <>
          Rooted in ritual.
          <br />
          <i>Alive in the present.</i>
        </>
      }
      intro="One of East Bangalore's oldest Bengali associations, bringing people together through culture, care and celebration."
      image="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1800&q=85"
    >
      <div className="interior-copy-grid">
        <div>
          <p className="eyebrow">Our story</p>
          <h2>A familiar feeling, shared across generations.</h2>
        </div>
        <div>
          <p>
            Poorva Bangalore Cultural Association (PBCA) is one of the oldest
            Bengali associations in East Bangalore. Established in 2004 by a few
            like minded individuals over simple cups of tea or “chai r adda” it
            has grown into a vibrant cultural institution.
          </p>
          <p>
            Located in the city’s IT corridor, PBCA has long attracted the
            energetic expatriate community, many of whom once felt the pangs of
            homesickness during festive seasons while juggling demanding work
            schedules. Through its celebrations, PBCA offers a true slice of
            home away from home. In an era of themed pujas and a fast changing
            cultural landscape, PBCA remains committed to upholding tradition
            while embracing modern ideas. Devotees from across the region join
            in the rituals, creating a lively spirit of community.
          </p>
          <p>
            Our mid day community bhog (Khichuri Bhog) brings the authentic
            taste of Bengal to Bangalore, while the evening cultural
            extravaganza showcases both in house talents and renowned artists
            from Kolkata.
          </p>
        </div>
      </div>
      <AboutUsGallery />
    </InteriorPage>
  );
}
