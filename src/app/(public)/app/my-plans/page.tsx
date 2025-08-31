"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { kencanApi } from "@/lib/api-list";
import { DatePlan } from "@/types/date-plans";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Loader2,
  CalendarHeart,
  Sparkles,
  Calendar,
  Heart,
  Plus,
  ArrowRight,
} from "lucide-react";
import { DATE_PLAN_PAGE_PATH } from "@/constants/path.const";
import { ThemeIcon } from "@/components/global/ThemeIcon";
import KencanLoader from "@/components/global/KencanLoader";
import { Background } from "@/components/global/Background";

export default function MyPlansPage() {
  const { user, isReady } = useAuth();
  const [plans, setPlans] = useState<DatePlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyPlans = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await kencanApi.datePlan.getMyPlans.call<DatePlan[]>();
        setPlans(response.data);
      } catch (error) {
        console.error("Failed to fetch plans", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Call the async function only when the auth state is ready
    if (isReady) {
      fetchMyPlans();
    }
  }, [isReady, user]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center">
        <KencanLoader title="Loading your date plans..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <Card className="text-center p-8 max-w-lg mx-auto border-0 shadow-brand-xl bg-gradient-bg-card">
          <CardHeader className="space-y-6">
            <div className="mx-auto w-20 h-20 bg-gradient-brand-primary rounded-full flex items-center justify-center shadow-brand-lg">
              <CalendarHeart className="h-10 w-10 text-white" />
            </div>
            <div className="space-y-3">
              <CardTitle className="text-3xl font-bold text-gradient-brand">
                Your Date Journey Awaits
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 leading-relaxed">
                Sign in to access your personalized date plans and create
                unforgettable memories together.
              </CardDescription>
            </div>
          </CardHeader>
          <Link href="/auth">
            <Button variant="love" className="mt-6 px-8 py-3 rounded-full">
              <Heart className="mr-2 h-4 w-4" />
              Sign In to Continue
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Background opacity={20} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-brand-primary rounded-full mb-6 shadow-brand-lg">
            <CalendarHeart className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold font-playfair mb-4 text-gradient-brand">
            Your Date Plans
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Relive your magical moments and discover new adventures waiting to
            be explored.
          </p>
          {plans.length > 0 && (
            <div className="mt-6 inline-flex items-center px-4 py-2 bg-brand-pink-50 rounded-full border border-brand-pink-200">
              <Calendar className="h-4 w-4 text-brand-pink-500 mr-2" />
              <span className="text-sm font-medium text-brand-pink-700">
                {plans.length} {plans.length === 1 ? "Plan" : "Plans"} Created
              </span>
            </div>
          )}
        </div>

        {plans.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {plans.map((plan) => (
                <Link href={`${DATE_PLAN_PAGE_PATH}/${plan.id}`} key={plan.id}>
                  <Card className="group relative overflow-hidden border-0 shadow-brand hover:shadow-brand-xl transition-all duration-500 ease-out hover:-translate-y-2 bg-white hover-lift">
                    {/* Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-bg-light opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-brand-soft opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>

                    <CardHeader className="relative p-8 text-center">
                      <div className="mb-6 transform group-hover:scale-110 transition-transform duration-500 ease-out">
                        <div className="w-16 h-16 mx-auto bg-gradient-brand-primary rounded-2xl shadow-brand-lg flex items-center justify-center">
                          <ThemeIcon
                            theme={plan.theme}
                            className="h-8 w-8 text-white mb-0"
                          />
                        </div>
                      </div>

                      <CardTitle className="text-xl font-bold capitalize mb-3 group-hover:text-brand-pink-600 transition-colors duration-300">
                        {plan.theme.toLowerCase()} Date
                      </CardTitle>

                      <CardDescription className="text-sm text-gray-500 mb-4">
                        Created on{" "}
                        {new Date(plan.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </CardDescription>

                      {/* View Details Button */}
                      <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <Button
                          variant="ghost"
                          className="text-brand-pink-600 hover:text-brand-pink-700 hover:bg-brand-pink-50 rounded-full px-6"
                        >
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Create New Plan CTA */}
            <div className="text-center">
              <div className="inline-block p-8 bg-gradient-bg-light rounded-3xl border border-brand-pink-200 shadow-brand-lg hover-glow">
                <Sparkles className="h-12 w-12 text-brand-pink-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Ready for Another Adventure?
                </h3>
                <p className="text-gray-600 mb-6 max-w-sm">
                  Create a new date plan and make more beautiful memories
                  together.
                </p>
                <Link href="/app">
                  <Button variant="love" className="px-8 py-3 rounded-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Plan
                  </Button>
                </Link>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center max-w-2xl mx-auto">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-brand-soft rounded-full blur-3xl"></div>
              <div className="relative w-32 h-32 mx-auto bg-gradient-bg-light rounded-full border-4 border-brand-pink-200 flex items-center justify-center shadow-brand-lg">
                <CalendarHeart className="h-16 w-16 text-brand-pink-400" />
              </div>
            </div>

            <h3 className="text-3xl font-bold text-gray-800 mb-4 font-playfair">
              Your Love Story Starts Here
            </h3>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              No date plans yet, but that&apos;s about to change! Let&apos;s
              craft your first magical adventure together and create memories
              that will last a lifetime.
            </p>

            <div className="space-y-4">
              <Link href="/app">
                <Button
                  variant="love"
                  className="px-10 py-4 rounded-full text-lg"
                >
                  <Sparkles className="mr-3 h-5 w-5" />
                  Create Your First Date Plan
                </Button>
              </Link>

              <p className="text-sm text-gray-500">
                ✨ Personalized • 🎯 Location-based • 💕 Romantic
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
