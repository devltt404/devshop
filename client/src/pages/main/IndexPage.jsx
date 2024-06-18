import BestSellingSection from "@/components/home/BestSellingSection.jsx";
import CategoriesSection from "@/components/home/CategoriesSection.jsx";
import EmailForm from "@/components/home/EmailForm.jsx";
import LatestSection from "@/components/home/LatestSection.jsx";
import HeroBg from "../../assets/hero.png";

export default function IndexPage() {
  return (
    <div className="container mb-24 flex flex-col gap-16">
      <img src={HeroBg} />
      <CategoriesSection />
      <BestSellingSection />
      <LatestSection />

      <EmailForm />
    </div>
  );
}
