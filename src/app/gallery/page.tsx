import InteriorPage from "@/components/InteriorPage";
import GallerySections from "@/components/GallerySections";

export default function GalleryPage() {
  return (
    <InteriorPage
      pageSlug="gallery"
      title={
        <>
          Every moment
          <br />
          <i>we shared.</i>
        </>
      }
      intro="A look back at the rituals, the stages, the volunteers and the families that make up PBCA."
      image="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1800&q=85"
    >
      <div className="interior-copy-grid">
        <div>
          <p className="eyebrow">The archive</p>
          <h2>Every collection, one community.</h2>
        </div>
        <div>
          <p>
            Browse highlights from across our celebrations. Every collection is
            maintained from the content desk, so the newest frames appear here as
            soon as they are published.
          </p>
        </div>
      </div>

      <GallerySections />
    </InteriorPage>
  );
}