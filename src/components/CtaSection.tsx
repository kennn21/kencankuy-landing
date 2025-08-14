// app/components/CtaSection.tsx
import { Apple, Play } from "lucide-react";
import Heart from "./Heart";

const CtaSection = () => {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Decorative Background Heart */}
      <Heart className="absolute top-1/2 -translate-y-1/2 -right-20 w-80 h-80 text-brand-pink opacity-5 transform rotate-[20deg]" />

      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="flex justify-center items-center gap-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Your next great date is waiting
          </h2>
          <Heart className="w-10 h-10 text-brand-pink -mt-3 hidden md:block" />
        </div>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Download KencanKuy now and start planning unforgettable experiences in
          Jakarta.
        </p>
        <div className="flex justify-center space-x-4">
          <button className="flex items-center bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors">
            <Apple className="w-6 h-6 mr-2" />
            <span>
              Download on the <br /> App Store
            </span>
          </button>
          <button className="flex items-center bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors">
            <Play className="w-6 h-6 mr-2" />
            <span>
              Get it on <br /> Google Play
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
