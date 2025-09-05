"use client";

import { Button } from "@/components/ui/button";
import { TimelineItem } from "@/components/global/TimelineItems";
import { Share2, Sparkles, Link as LinkIcon, FileDown } from "lucide-react";
import { toast } from "sonner";
import { DatePlan } from "@/types/date-plans";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

export function PlanDisplay({ plan }: { plan: DatePlan }) {
  const places = plan.steps.map((step) => step.place);
  const { user } = useAuth();
  const isUserOwner = user && plan.userId && user.uid === plan.userId;

  const [isShareOpen, setIsShareOpen] = useState(false);

  const shareUrl = `${window.location.origin}/plan/${plan.id}`;

  const handleShareLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard!");
    setIsShareOpen(false);
  };

  const handleSharePdf = () => {
    // This will open the download link in a new tab, triggering the download
    window.open(`${process.env.NEXT_PUBLIC_BASE_URL}/date-plan/${plan.id}/pdf`);
    toast.info("Your PDF is downloading...");
    setIsShareOpen(false);
  };

  return (
    <div className="relative z-10 w-full max-w-lg space-y-4">
      <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 font-playfair">
        {isUserOwner ? "Your Date Itinerary" : "A Date Itinerary For You"}
      </h2>

      <div className="timeline-container py-4">
        {places.map((place, index) => (
          <TimelineItem key={place.id} place={place} index={index} />
        ))}
      </div>

      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
        {/* The Share button now triggers a Popover */}
        <Popover open={isShareOpen}>
          <PopoverTrigger asChild>
            <Button
              className="w-full sm:w-1/2 bg-pink-500 hover:bg-pink-600 text-white"
              onClick={() => setIsShareOpen((prev) => !prev)}
            >
              <Share2 className="mr-2 h-4 w-4" /> Share This Plan
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2">
            <div className="grid gap-2">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={handleShareLink}
              >
                <LinkIcon className="mr-2 h-4 w-4" />
                Share as Link
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={handleSharePdf}
              >
                <FileDown className="mr-2 h-4 w-4" />
                Share as PDF
              </Button>
            </div>
          </PopoverContent>
        </Popover>

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
