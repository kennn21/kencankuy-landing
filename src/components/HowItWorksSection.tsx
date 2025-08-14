// app/components/HowItWorksSection.tsx
const HowItWorksSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Decorative line for larger screens */}
          <div
            className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gray-200 -translate-y-1/2"
            style={{ top: "24px" }}
          ></div>

          {/* Step 1 */}
          <div className="relative">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-brand-pink text-white rounded-full text-2xl font-bold">
              1
            </div>
            <h3 className="text-xl font-bold mb-2">Select Your Vibe</h3>
            <p className="text-gray-600">
              Choose your location, budget, and transportation preferences.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-brand-pink text-white rounded-full text-2xl font-bold">
              2
            </div>
            <h3 className="text-xl font-bold mb-2">Get Your Plan</h3>
            <p className="text-gray-600">
              Instantly receive a curated date plan tailored just for you.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-brand-pink text-white rounded-full text-2xl font-bold">
              3
            </div>
            <h3 className="text-xl font-bold mb-2">Enjoy Your Date!</h3>
            <p className="text-gray-600">
              Follow the plan, have an amazing time, and make unforgettable
              memories.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
