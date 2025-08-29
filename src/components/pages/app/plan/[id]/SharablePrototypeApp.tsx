"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Background } from "@/components/global/Background";
import { Button } from "@/components/ui/button";
import { kencanApi } from "@/lib/api-list";
import { DatePlan } from "@/types/date-plans";
import { Loader2 } from "lucide-react";
import { PlanDisplay } from "./PlanDisplay";

// The data fetching function remains mostly the same
async function getPlanData(id: string): Promise<DatePlan | null> {
  try {
    // The ApiBuilder now returns the full AxiosResponse
    const response = await kencanApi.datePlan.getById.call<DatePlan>({
      params: { id },
    });
    // We access the data via response.data
    return response.data;
  } catch (error) {
    console.error("Failed to fetch plan data:", error);
    return null;
  }
}

export default function ShareablePlanPage() {
  const params = useParams();
  const planId = params.id as string;

  const [plan, setPlan] = useState<DatePlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!planId) return;

    const fetchPlan = async () => {
      setLoading(true);
      setError(null);
      const data = await getPlanData(planId);
      if (data) {
        setPlan(data);
      } else {
        setError("The plan could not be found.");
      }
      setLoading(false);
    };

    fetchPlan();
  }, [planId]);

  if (loading) {
    return (
      <main className="min-h-screen w-full bg-pink-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-pink-500" />
      </main>
    );
  }

  if (error || !plan) {
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
      <PlanDisplay plan={plan} />
    </main>
  );
}
