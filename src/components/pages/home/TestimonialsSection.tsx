// app/components/TestimonialsSection.tsx
import { Star } from "lucide-react";

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-brand-pink-light">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-8">
          Don&apos;t just take our word for it.
        </h2>
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
            ))}
          </div>
          <p className="text-lg italic text-gray-600 mb-4">
            &quot;KencanKuy saved my anniversary! We discovered an amazing
            hidden gem in Kemang thanks to the app. 10/10 would recommend!&quot;
          </p>
          <p className="font-bold text-gray-800">- Placeholder User</p>
          <p className="text-sm text-gray-500">Early Adopter</p>
        </div>
        <p className="text-gray-500 mt-8">
          More reviews coming soon after launch!
        </p>
      </div>
    </section>
  );
};

export default TestimonialsSection;
