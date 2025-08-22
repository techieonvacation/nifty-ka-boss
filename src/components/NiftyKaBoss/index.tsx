import NiftyKaBossHeroSection from "./HeroSection";
import WhyNiftyKaBoss from "./WhyNiftyKaBoss";
import NiftyKaBossPricing from "./Pricing";
import NiftyKaBossFaq from "./NiftyKaBossFaq";

export default function NiftyKaBoss() {
  return (
    <div className="min-h-screen">
      <NiftyKaBossHeroSection />
      <WhyNiftyKaBoss />
      <NiftyKaBossPricing />
      <NiftyKaBossFaq />
    </div>
  );
}
