import BestSellingSection from "@/components/home/BestSellingSection.jsx";
import CategoriesSection from "@/components/home/CategoriesSection.jsx";
import LatestSection from "@/components/home/LatestSection.jsx";
import HeroBg from "../../assets/hero.jpeg";

export default function IndexPage() {
  return (
    <div className="mb-24 space-y-14">
      <div className="container mt-8">
        <img src={HeroBg} alt="hero" className="object-cover" />
      </div>

      <CategoriesSection />
      <BestSellingSection />
      <LatestSection />
    </div>
  );
}
