import { Background } from "@/components/global/Background";
import { TimelineItem } from "@/components/global/TimelineItems";
import { Button } from "@/components/ui/button";
import { DatePlan } from "@/types/date-plans";
import Link from "next/link";

async function getPlanData(id: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/date-plan/${id}`,
      {
        cache: "no-store",
      }
    );
    console.log("Response status:", response.status);
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error("Failed to fetch plan data:", error);
    return null;
  }
}

export default async function ShareablePlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: planId } = await params;

  const plan: DatePlan = await getPlanData(planId);

  console.log(plan);

  if (!planId) {
    return (
      <main className="min-h-screen w-full bg-pink-50 flex items-center justify-center text-center p-4">
        <div>
          <h1 className="text-3xl font-bold font-playfair text-gray-800">
            Plan Not Found
          </h1>
          <p className="text-gray-600 mt-2">
            The link may be broken or the plan has been deleted.
          </p>
          <Link href="/app">
            <Button className="mt-4 bg-brand-pink hover:bg-pink-400">
              Create a New Plan
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  if (!plan) {
    return (
      <main className="min-h-screen w-full bg-pink-50 flex items-center justify-center text-center p-4">
        <div>
          <h1 className="text-3xl font-bold font-playfair text-gray-800">
            Plan Not Found
          </h1>
          <p className="text-gray-600 mt-2">
            The link may be broken or the plan has been deleted.
          </p>
          <Link href="/app">
            <Button className="mt-4 bg-brand-pink hover:bg-pink-400">
              Create a New Plan
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-pink-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <Background />
      <div className="relative z-10 w-full max-w-lg space-y-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 font-playfair">
          A Date Itinerary For You
        </h2>

        <div className="timeline-container py-4">
          {plan.steps.map(({ id, place }, index) => (
            <TimelineItem key={id} place={place} index={index} />
          ))}
        </div>
      </div>
    </main>
  );
}
