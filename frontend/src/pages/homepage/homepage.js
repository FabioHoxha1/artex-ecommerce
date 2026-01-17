import { HeroSection } from "./heroSection";
import { WhyChooseUsSection } from "./whyChooseUsSection";
import ProductsSection from "./productsSection";
// removed unused useLocation import
import FooterSection from "../../components/footerSection";

const Homepage = () => {
  return (
    <>
      <HeroSection />
      <WhyChooseUsSection />
      <ProductsSection />
      <FooterSection />
    </>
  );
};
export default Homepage;
