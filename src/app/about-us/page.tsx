import InteriorPage from "@/components/InteriorPage";
import AboutUsCarousel, {
  type AboutUsCarouselItem,
} from "@/components/ui/AboutUsCarousel";
import { prisma } from "@/lib/prisma";
import { galleryImageUrl } from "@/lib/gallery";

// The carousel mirrors the About Us gallery in the admin portal, so the page
// renders per request and picks up new uploads on refresh instead of waiting
// for a redeploy (same reasoning as the galleries API routes).
export const dynamic = "force-dynamic";

export default async function AboutUsPage() {
  const gallery = await prisma.gallery.findFirst({
    where: { pageSlug: "about-us", published: true },
    include: {
      images: {
        where: { published: true },
        // Matches sortGalleryImages: position first, creation time as tiebreak.
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      },
    },
  });

  const carouselItems: AboutUsCarouselItem[] = (gallery?.images ?? []).map(
    (image) => ({
      id: image.id,
      url: galleryImageUrl(image.storageKey),
      title: image.title || image.altText,
    }),
  );

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
      <AboutUsCarousel items={carouselItems} />
    </InteriorPage>
  );
}
