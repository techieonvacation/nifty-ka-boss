import About from "@/components/Home/About/About";
import Banner from "@/components/Home/Banner/Banner";
import BhrahmastraSec from "@/components/Home/BhrahmastraSec";
import DownloadApp from "@/components/Home/DownloadApp";
import Pricing from "@/components/Home/Pricing/Pricing";
import WhyJoinUs from "@/components/Home/WhyJoin";
import BookPublished from "@/components/ui/BookPublished";
import Faq from "@/components/ui/Faq";
import RegisteredBy from "@/components/ui/RegisteredBy";
import SocialMedia from "@/components/ui/SocialMedia";
import Testimonials from "@/components/ui/Testimonial/Testimonial";
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black">
      <Banner />
      <RegisteredBy />
      <WhyJoinUs />
      <About />
      <BhrahmastraSec />
      <Pricing />
      <BookPublished />
      <DownloadApp />
      <Testimonials />
      <SocialMedia />
      <Faq />
    </main>
  );
}
