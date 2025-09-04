"use client";

import { Button } from "@/components/ui/button";
import { TimelineItem } from "@/components/global/TimelineItems";
import { Share2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { DatePlan } from "@/types/date-plans";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { DATE_PLAN_PAGE_PATH } from "@/constants/path.const";

export function PlanDisplay({ plan }: { plan: DatePlan }) {
  const places = plan.steps.map((step) => step.place);
  const { user } = useAuth();

  const handleShare = () => {
    const shareUrl = `${DATE_PLAN_PAGE_PATH}/${plan.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard!");
  };

  // Determine if the current user is the owner of the plan
  const isUserOwner = user && plan.userId && user.uid === plan.userId;

  return (
    <div className="relative z-10 w-full max-w-lg space-y-4">
      <h2 className="text-3xl sm:text-4xl font-bold text-center text-gradient-brand font-playfair">
        {isUserOwner ? "Your Date Itinerary" : "A Date Itinerary For You"}
      </h2>

      <div className="timeline-container py-4">
        {places.map((place, index) => (
          <TimelineItem key={place.id} place={place} index={index} />
        ))}
      </div>

      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
        <Button
          onClick={handleShare}
          className="w-full sm:w-1/2 bg-pink-500 hover:bg-pink-600 text-white"
        >
          <Share2 className="mr-2 h-4 w-4" /> Share This Plan
        </Button>

        {/* Simplified and corrected button logic */}
        <Link href="/app" className="w-full sm:w-1/2">
          <Button
            variant="outline"
            className="w-full bg-white/50 backdrop-blur-sm"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {isUserOwner ? "Create New Plan" : "Create Your Own Plan"}
          </Button>
        </Link>
      </div>
    </div>
  );
}
