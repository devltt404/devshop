import BestSellingSection from "@/components/home/BestSellingSection.jsx";
import CategoriesSection from "@/components/home/CategoriesSection.jsx";
import LatestSection from "@/components/home/LatestSection.jsx";
import HeroBg from "../../assets/hero.jpeg";

export default function IndexPage() {
  return (
    <div className="mb-24 space-y-14">
      <img
        src={HeroBg}
        alt="hero"
        className="container mt-8 aspect-[1400/500] object-cover"
      />

      <CategoriesSection />
      <BestSellingSection />
      <LatestSection />
    </div>
  );
}
