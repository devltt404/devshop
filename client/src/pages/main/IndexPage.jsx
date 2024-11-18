import HeroImg from "@/assets/hero.webp";
import BestSellingSection from "@/components/home/BestSellingSection.jsx";
import CategoriesSection from "@/components/home/CategoriesSection.jsx";
import LatestSection from "@/components/home/LatestSection.jsx";

export default function IndexPage() {
  return (
    <div className="mb-24">
      <img
        src={HeroImg}
        alt="Hero iphone banner"
        className="aspect-[4/3] w-full object-cover lg:aspect-[1440/486]"
      />

      <CategoriesSection />
      <BestSellingSection />
      <LatestSection />
    </div>
  );
}
