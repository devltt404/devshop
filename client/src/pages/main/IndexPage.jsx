import BestSellingSection from "@/components/home/BestSellingSection.jsx";
import CategoriesSection from "@/components/home/CategoriesSection.jsx";
import LatestSection from "@/components/home/LatestSection.jsx";
import { MEDIA_QUERY } from "@/constants/index.js";
import useMediaQuery from "@/hooks/useMediaQuery.jsx";

export default function IndexPage() {
  const isTablet = useMediaQuery(MEDIA_QUERY.TABLET);

  return (
    <div className="mb-24">
      <div className="aspect-[4/3] lg:aspect-[1440/566]">
        <img
          src={
            "https://www.apple.com/v/iphone-16-pro/c/images/overview/welcome/hero_endframe__b3cjfkquc2s2_xlarge.jpg"
          }
          alt="iphone banner"
          className="h-full w-full object-cover"
        />
      </div>

      <CategoriesSection />
      <BestSellingSection />
      <LatestSection />
    </div>
  );
}
