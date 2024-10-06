import BestSellingSection from "@/components/home/BestSellingSection.jsx";
import CategoriesSection from "@/components/home/CategoriesSection.jsx";
import LatestSection from "@/components/home/LatestSection.jsx";
import HeroBg from "../../assets/hero.jpeg";

export default function IndexPage() {
  return (
    <div className="mb-24 space-y-10 md:space-y-14">
      <img
        src={HeroBg}
        alt="hero"
        className="mt-8 aspect-[1400/500] min-h-[11.5rem] object-cover xl:container"
      />

      <CategoriesSection />
      <BestSellingSection />
      <LatestSection />
    </div>
  );
}
