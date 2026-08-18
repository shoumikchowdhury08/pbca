import InteriorPage from "@/components/InteriorPage";

export default function AboutUsPage() {
  return <InteriorPage eyebrow="01 / ABOUT PBCA" title={<>Rooted in ritual.<br /><i>Alive in the present.</i></>} intro="One of East Bangalore's oldest Bengali associations, bringing people together through culture, care and celebration." image="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1800&q=85">
    <div className="interior-copy-grid"><div><p className="eyebrow">Our story</p><h2>A familiar feeling, shared across generations.</h2></div><div><p>PBCA began as a small community gathering and has grown into a home for Bengali families, friends and curious neighbours across East Bangalore.</p><p>Our Durga Puja is the centre of that story, but the association lives all year through music, food, language, friendships and the generosity of people who make room for one another.</p></div></div>
  </InteriorPage>;
}
