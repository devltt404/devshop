import BestSellingSection from "@/components/home/BestSellingSection.jsx";
import CategoriesSection from "@/components/home/CategoriesSection.jsx";
import EmailForm from "@/components/home/EmailForm.jsx";
import LatestSection from "@/components/home/LatestSection.jsx";
import HeroBg from "../../assets/hero.jpeg";

export default function IndexPage() {
  return (
    <div className="mb-24 flex flex-col gap-20">
      <div className="container mt-12">
        <img src={HeroBg} alt="hero" className="object-cover" />
      </div>

      <CategoriesSection />
      <BestSellingSection />
      <LatestSection />

      <EmailForm />
    </div>
  );
}
