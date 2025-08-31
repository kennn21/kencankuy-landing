import CtaSection from "../../components/pages/home/CtaSection";
import FeaturesSection from "../../components/pages/home/FeaturesSection";
import Footer from "../../components/pages/home/Footer";
import HeroSection from "../../components/pages/home/HeroSection";
import HowItWorksSection from "../../components/pages/home/HowItWorksSection";
import ProblemSolutionSection from "../../components/pages/home/ProblemSolutionSection";
import TestimonialsSection from "../../components/pages/home/TestimonialsSection";

export default function Home() {
  return (
    <main className="bg-white text-gray-800">
      <HeroSection />
      <ProblemSolutionSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
