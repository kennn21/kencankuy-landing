// app/components/FeaturesSection.tsx
import { MapPin, Wallet, Sparkles, Dices } from "lucide-react";

const features = [
  {
    icon: <MapPin className="w-10 h-10 text-brand-pink" />,
    title: "Smart Plans for Jakarta",
    description:
      "Find date ideas tailored to Jakarta's best neighborhoods—from the historical charm of Kota Tua to the trendy spots in Senopati.",
  },
  {
    icon: <Wallet className="w-10 h-10 text-brand-pink" />,
    title: "Budget-Friendly Fun",
    description:
      "Filter by your budget (Low, Mid-Range, High-End) so you can focus on the date, not the cost.",
  },
  {
    icon: <Sparkles className="w-10 h-10 text-brand-pink" />,
    title: "Themed Dates",
    description:
      "Explore date plans by theme, whether you're feeling 'Artsy,' 'Sporty,' or a classic 'Romantic' evening out.",
  },
  {
    icon: <Dices className="w-10 h-10 text-brand-pink" />,
    title: "The 'Surprise Me' Button",
    description:
      "Feeling spontaneous? Get an instant, random date idea with one tap and let the adventure begin.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-brand-pink-light">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow text-center"
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
