"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";

import { Background } from "@/components/global/Background"; // 1. Import the new background
import { LocationAutocomplete } from "@/components/global/LocationAutocomplete";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PLACE_CATEGORIES } from "@/constants/form.const";
import {
  ExternalLink,
  GlassWater,
  Heart,
  Loader2,
  MapPin,
  PartyPopper,
  Shirt,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import Icon from "@/components/global/Icon";
import { toast } from "sonner";

// Define types
type Place = {
  id: number;
  name: string;
  address: string;
  googlePlaceId: string;
  latitude: number;
  longitude: number;
  photoReference: string | null;
};

const formSchema = z.object({
  location: z.object({ lat: z.number(), lng: z.number() }),
  category: z.string(),
  budget: z.coerce.number().optional(),
});

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
  exit: { opacity: 0, y: -20 },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

const getDressCode = (category: string): string => {
  switch (category) {
    case "romantic":
    case "artsy":
      return "Smart Casual";
    case "foodie":
      return "Casual Chic";
    case "adventurous":
    case "sporty":
      return "Comfortable Activewear";
    default:
      return "Casual";
  }
};

export default function PrototypeAppPage() {
  const [stage, setStage] = useState<
    | "idle"
    | "fetchingLocation"
    | "mapPicker"
    | "options"
    | "fetchingPlan"
    | "results"
  >("idle");
  const [places, setPlaces] = useState<Place[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { category: "romantic" },
  });

  const selectedCategory = form.watch("category");

  const handleStart = () => {
    setStage("fetchingLocation");
    setApiError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        form.setValue("location", {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setStage("options");
      },
      () => {
        // Use a toast for the error message
        toast.error("Automatic location failed.", {
          description: "Please pick a location manually to continue.",
        });
        // Transition to the map picker after showing the toast
        setStage("mapPicker");
      },
      { timeout: 5000 } // Add a timeout to prevent it from hanging
    );
  };

  // Handler for when a location is selected from the map picker
  const handleManualLocationSelect = (location: {
    lat: number;
    lng: number;
  }) => {
    form.setValue("location", location);
    setApiError(null);
    setStage("options");
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setStage("fetchingPlan");
    setApiError(null);
    try {
      const body = {
        category: values.category,
        lat: values.location.lat,
        lng: values.location.lng,
        ...(values.budget && { budget: values.budget }),
      };
      const response = await fetch(`http://localhost:8081/date-plan/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error("Failed to find a date plan.");
      const data = await response.json();
      setPlaces(data.steps.map((step: any) => step.place));
      setStage("results");
    } catch (err: any) {
      setApiError(err.message);
      setStage("options");
    }
  };

  const reset = () => {
    setPlaces([]);
    setApiError(null);
    setStage("idle");
  };

  return (
    <main className="min-h-screen w-full bg-pink-50 flex items-center justify-center p-4 sm:p-6 md:p-8 relative">
      <Background />
      <AnimatePresence mode="wait">
        {stage === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center"
          >
            {/* Animate the scale for a heartbeat effect */}
            <motion.div
              animate={{ scale: [1, 1.05, 1] }} // Slightly scale up and back down
              transition={{
                duration: 1, // Adjust the speed of the heartbeat
                ease: "easeInOut",
                repeat: Infinity,
              }}
            >
              <Button
                size="lg"
                className="h-16 px-6 sm:px-8 text-lg sm:text-xl bg-brand-pink hover:bg-pink-400 rounded-full shadow-lg"
                onClick={handleStart}
              >
                Kencan kuy
                <Heart fill="white" />
              </Button>
            </motion.div>
            {apiError && <p className="text-red-500 mt-4">{apiError}</p>}
          </motion.div>
        )}

        {/* STAGE 2: FETCHING LOCATION */}
        {stage === "fetchingLocation" && (
          <motion.div
            key="fetchingLocation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center space-y-2 text-gray-600"
          >
            <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
            <p>Finding your location...</p>
          </motion.div>
        )}

        {/* STAGE 3: MAP PICKER (FALLBACK) */}
        {stage === "mapPicker" && (
          <motion.div
            key="mapPicker"
            // ... (variants and props)
            className="w-full max-w-sm flex flex-col items-center"
          >
            {/* The toast now handles the error message, so we don't need to show it here */}
            <LocationAutocomplete
              onLocationSelect={handleManualLocationSelect}
              currentLocation={null}
            />
          </motion.div>
        )}

        {/* STAGE 4: OPTIONS */}
        {(stage === "options" || stage === "fetchingPlan") && (
          <motion.div
            key="options"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-sm"
          >
            <Card className="shadow-2xl shadow-pink-200/50">
              <CardHeader className="text-center">
                <motion.div variants={itemVariants}>
                  <CardTitle className="text-2xl">
                    Just a few details...
                  </CardTitle>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <CardDescription className="text-pink-400 font-semibold">
                    What&apos;s the vibe for today?
                  </CardDescription>
                </motion.div>
              </CardHeader>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                  <motion.div variants={itemVariants}>
                    <Controller
                      name="category"
                      control={form.control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {PLACE_CATEGORIES.map(({ icon, label, value }) => (
                              <SelectItem
                                key={`category-${value}`}
                                value={value}
                              >
                                <Icon name={icon} />
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Controller
                      name="budget"
                      control={form.control}
                      render={({ field }) => (
                        <Input
                          type="number"
                          placeholder="Max Budget (optional)"
                          {...field}
                        />
                      )}
                    />
                  </motion.div>
                </CardContent>
                <CardFooter className="pt-4">
                  <Button
                    type="submit"
                    disabled={stage === "fetchingPlan"}
                    className="w-full bg-brand-pink hover:bg-pink-400 text-white font-bold"
                  >
                    {stage === "fetchingPlan" ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Create My Itinerary"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </motion.div>
        )}

        {/* STAGE 5: RESULTS (UPDATED) */}
        {stage === "results" && (
          <motion.div
            key="results"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-lg space-y-4"
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl sm:text-4xl font-bold text-center text-gray-800 font-playfair"
            >
              Your Date Itinerary
            </motion.h2>

            {/* 2. Add the new Plan Details Card */}
            <motion.div variants={itemVariants}>
              <Card className="bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Plan Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <PartyPopper className="h-4 w-4 mr-3 text-pink-500" />
                    <span className="font-semibold mr-2">Theme:</span>
                    <span className="capitalize">{selectedCategory}</span>
                  </div>
                  <div className="flex items-center">
                    <Shirt className="h-4 w-4 mr-3 text-pink-500" />
                    <span className="font-semibold mr-2">Dress Code:</span>
                    <span>{getDressCode(selectedCategory)}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* The timeline container */}
            <div className="timeline-container py-4">
              {places.map((place, index) => {
                // Construct the photo URL
                const photoUrl = place.photoReference
                  ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photoreference=${place.photoReference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
                  : null;

                // Construct the "Open in Maps" URL
                const openInMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  place.name
                )}&query_place_id=${place.googlePlaceId}`;
                return (
                  <motion.div
                    key={place.id}
                    variants={itemVariants}
                    className="timeline-item"
                  >
                    <div className="timeline-icon">
                      {index === 0 && <Sparkles size={20} />}
                      {index === 1 && <UtensilsCrossed size={20} />}
                      {index === 2 && <GlassWater size={20} />}
                    </div>

                    <div className="timeline-card">
                      <Card className="w-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                        {/* Re-added the image preview */}
                        <div className="relative w-full h-40 bg-gray-200">
                          {photoUrl ? (
                            <img
                              src={photoUrl}
                              alt={`Photo of ${place.name}`}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <MapPin className="h-10 w-10 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <CardHeader
                          className={`${
                            index % 2 !== 0 ? "text-right" : "text-left"
                          }`}
                        >
                          <CardTitle className="text-lg sm:text-xl">
                            {place.name}
                          </CardTitle>
                          {/* <CardDescription
                            className={`flex items-center text-xs sm:text-sm text-gray-500 ${
                              index % 2 !== 0 ? "justify-end" : "justify-start"
                            }`}
                          >
                            <MapPin className="h-3 w-3 mr-1.5 flex-shrink-0" />
                            {place.address}
                          </CardDescription> */}
                        </CardHeader>
                        {/* Re-added the "Open in Maps" link */}
                        <CardFooter
                          className={`pb-4 ${
                            index % 2 !== 0 ? "justify-end" : "justify-start"
                          }`}
                        >
                          <a
                            href={openInMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-xs text-pink-600 hover:text-pink-800 font-semibold"
                          >
                            Open in Google Maps
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </CardFooter>
                      </Card>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center gap-2"
            >
              <motion.h1>Don&apos;t like it?</motion.h1>
              <Button
                onClick={reset}
                variant="outline"
                className="w-full bg-white/50 backdrop-blur-sm"
              >
                Start Over
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
