// app/components/ProblemSolutionSection.tsx
import Heart from "./Heart"; // Import the Heart component

const ProblemSolutionSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6 text-center">
        {/* Problem */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Tired of the same old dates?
          </h2>
          <p className="text-lg text-gray-600">
            We get it. Spending hours searching for the perfect date idea,
            getting stuck in Jakarta traffic, and worrying about the budget is
            frustrating. Planning a date shouldn&apos;t feel like a chore.
          </p>
        </div>

        {/* Solution */}
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center items-center gap-3">
            <h2 className="text-3xl font-bold mb-4 text-brand-pink">
              Your perfect date, planned in minutes.
            </h2>
            <Heart className="w-8 h-8 text-brand-pink -mt-3" />
          </div>
          <p className="text-lg text-gray-600">
            KencanKuy takes the guesswork out of date planning. We provide
            curated, location-based, and budget-friendly date plans across
            Jakarta, so you can focus on what really matters: connecting with
            your special someone.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolutionSection;
