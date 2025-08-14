import CtaSection from "../components/CtaSection";
import FeaturesSection from "../components/FeaturesSection";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import HowItWorksSection from "../components/HowItWorksSection";
import ProblemSolutionSection from "../components/ProblemSolutionSection";
import TestimonialsSection from "../components/TestimonialsSection";

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
