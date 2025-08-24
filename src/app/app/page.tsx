"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";

import { LocationAutocomplete } from "@/components/LocationAutocomplete";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loader2, Sparkles, MapPin, Heart } from "lucide-react";
import { Background } from "@/components/Background"; // 1. Import the new background

// Define types
type Place = { id: number; name: string; address: string };
type Location = { lat: number; lng: number };

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

export default function AppPage() {
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
        // Fallback to map picker on failure
        setApiError(
          "Automatic location failed. Please pick a location manually."
        );
        setStage("mapPicker");
      }
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
    <main className="min-h-screen w-full bg-pink-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <Background /> {/* 2. Add the background component here */}
      <AnimatePresence mode="wait">
        {/* STAGE 1: IDLE */}
        {stage === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center"
          >
            <Button
              size="lg"
              className="h-16 px-6 sm:px-8 text-lg sm:text-xl bg-pink-500 hover:bg-pink-600 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-200"
              onClick={handleStart}
            >
              <Sparkles className="mr-3 h-6 w-6" /> Find a Magical Date
            </Button>
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
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-sm flex flex-col items-center"
          >
            {apiError && (
              <p className="text-red-500 mb-4 text-center font-medium">
                {apiError}
              </p>
            )}
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
                  <CardDescription className="text-pink-500 font-semibold">
                    What's the vibe for today?
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
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="romantic">
                              <Heart className="inline-block mr-2 h-4 w-4 text-red-400" />
                              Romantic
                            </SelectItem>
                            <SelectItem value="foodie">Foodie</SelectItem>
                            <SelectItem value="artsy">Artsy</SelectItem>
                            {/* Add more categories here */}
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
                <CardFooter>
                  <Button
                    type="submit"
                    disabled={stage === "fetchingPlan"}
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold"
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

        {/* STAGE 5: RESULTS */}
        {stage === "results" && (
          <motion.div
            key="results"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-md space-y-4"
          >
            <motion.h2
              variants={itemVariants}
              className="text-2xl sm:text-3xl font-bold text-center text-gray-800"
            >
              Your Date Itinerary
            </motion.h2>
            {places.map((place, index) => (
              <motion.div variants={itemVariants} key={place.id}>
                <Card className="w-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg sm:text-xl">
                      <span className="flex items-center justify-center h-8 w-8 bg-pink-500 text-white rounded-full font-bold mr-4">
                        {index + 1}
                      </span>
                      {place.name}
                    </CardTitle>
                    <CardDescription className="pl-12 flex items-center text-xs sm:text-sm text-gray-500">
                      <MapPin className="h-3 w-3 mr-1.5 flex-shrink-0" />{" "}
                      {place.address}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
            <motion.div variants={itemVariants}>
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
