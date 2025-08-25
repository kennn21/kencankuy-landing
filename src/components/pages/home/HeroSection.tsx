// app/components/HeroSection.tsx
import CallToActions from "../../global/CallToActions";
import Heart from "./Heart"; // Import the Heart component

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center bg-brand-pink-light overflow-hidden">
      {/* Decorative Background Hearts */}
      <Heart className="absolute -top-16 -left-16 w-64 h-64 text-brand-pink opacity-10 transform rotate-[-30deg]" />
      <Heart className="absolute -bottom-24 -right-16 w-80 h-80 text-brand-pink opacity-10 transform rotate-[20deg]" />

      <div className="container mx-auto px-6 py-12 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
              Say goodbye to boring dates.
              <br />
              <span className="text-brand-pink">Say hello to KencanKuy.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Your personal date planner for Jakarta. Curated plans, just a tap
              away.
            </p>
            <CallToActions type="prototype" />
          </div>

          {/* Phone Mockup Visual */}
          <div className="flex justify-center">
            <div className="relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
              <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
              <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
              <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
              <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
              <div className="rounded-[2rem] overflow-hidden w-full h-full bg-white">
                <div className="w-full h-full bg-brand-pink-light flex flex-col justify-center items-center p-4">
                  <div className="text-brand-pink">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="80"
                      height="80"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-heart-handshake"
                    >
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                      <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.82 2.94 0l.06-.06L12 11l2.94-2.96a2.17 2.17 0 0 1 3.08 0v0c.82.82.82 2.13 0 2.94l-2.06 2.06" />
                    </svg>
                  </div>
                  <p className="text-xl font-bold text-brand-pink mt-4">
                    KencanKuy
                  </p>
                  <p className="text-center text-gray-500 mt-2 text-sm">
                    A beautiful date plan appears here.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
