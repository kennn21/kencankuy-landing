"use client";

import CustomHeart from "@/components/pages/home/Heart";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Background } from "@/components/global/Background";
import Icon from "@/components/global/Icon";
import { LocationAutocomplete } from "@/components/global/LocationAutocomplete";
import { LocationLoader } from "@/components/global/LocationLoader";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
  DATE_PLAN_PAGE_PATH,
  PROTOTYPE_APP_PATH,
} from "@/constants/path.const";
import { DatePlan } from "@/types/date-plans";
import { Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { kencanApi } from "@/lib/api-list";
import KencanLoader from "@/components/global/KencanLoader";

const formSchema = z.object({
  location: z.object(
    { lat: z.number(), lng: z.number() },
    { error: "Please select a location." }
  ),
  category: z.string({ error: "Please select a category." }),
  budget: z.coerce
    .number()
    .optional()
    .transform((val) => (val === 0 || isNaN(Number(val)) ? undefined : val)),
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

export default function PrototypeAppPage() {
  const router = useRouter();
  const [stage, setStage] = useState<
    | "idle"
    | "fetchingLocation"
    | "mapPicker"
    | "options"
    | "fetchingPlan"
    | "results"
  >("idle");
  const [remaining, setRemaining] = useState<number | null>(5); // Remaining requests
  const [datePlan, setDatePlan] = useState<DatePlan | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { category: "romantic", budget: undefined },
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
        toast.error("Automatic location failed.", {
          description: "Please pick a location manually to continue.",
        });
        setStage("mapPicker");
      },
      { timeout: 5000 }
    );
  };

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
      const response = await kencanApi.datePlan.generate.call<DatePlan>({
        data: body,
      });
      console.log(response);
      // 2. Read the headers from the response
      const remainingRequests = response.headers["x-ratelimit-remaining"];

      if (remainingRequests) {
        setRemaining(Number(remainingRequests));
      }

      router.push(`${DATE_PLAN_PAGE_PATH}/${response.data.id}`);
    } catch (err) {
      setApiError((err as { message: string }).message);
      setStage("options");

      if (remaining === 0) {
        toast.error(
          "You have reached your request limit. Please sign in for more access."
        );
        return;
      }
      toast.error("Sorry! Failed to create a date plan.", {
        description:
          (err as { message: string }).message ||
          "Please try again with different options.",
      });
    }
  };

  const placeCategoriesOptions = useMemo(() => {
    return PLACE_CATEGORIES.map((category) => (
      <SelectItem key={category.value} value={category.value}>
        <div className="flex items-center space-x-2">
          <Icon name={category.icon} className="w-4 h-4" />
          <span>{category.label}</span>
        </div>
      </SelectItem>
    ));
  }, []);

  useEffect(() => {
    const getRateLimitStatus = async () => {
      try {
        const { data } = await kencanApi.rateLimit.getStatus.call();

        setRemaining(data.remaining);
      } catch (error) {
        console.error("Could not fetch rate limit status:", error);
      }
    };

    getRateLimitStatus();
  }, []);

  return (
    <main className="min-h-screen w-full  flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden">
      <Background />
      <AnimatePresence mode="wait">
        {stage === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="text-center"
          >
            <div className="text-center flex flex-col items-center justify-center">
              <motion.h1
                variants={itemVariants}
                className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 mb-4 font-playfair text-gradient-brand"
              >
                KencanKuy
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="text-lg sm:text-xl text-black mb-8 max-w-md"
              >
                Spontaneous, AI-powered date plans.
                <br />
                Ready when you are.
              </motion.p>
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  onClick={handleStart}
                  className="relative flex items-center justify-center h-40 w-40 sm:h-48 sm:w-48 rounded-full focus:outline-none "
                >
                  <motion.div
                    className="absolute flex items-center justify-center w-full h-full"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{
                      duration: 1,
                      ease: "easeInOut",
                      repeat: Infinity,
                    }}
                  >
                    <CustomHeart className="absolute w-full h-full text-brand-pink" />
                    <span className="relative z-1 text-white text-2xl -translate-y-1 font-bold font-playfair">
                      Start
                    </span>
                  </motion.div>
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {stage === "fetchingLocation" && (
          <motion.div
            key="fetchingLocation"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <LocationLoader />
          </motion.div>
        )}

        {stage === "mapPicker" && (
          <motion.div
            key="mapPicker"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-sm flex flex-col items-center gap-8"
          >
            <h1 className="text-3xl text-gradient-brand">
              Choose your Location
            </h1>

            <motion.div variants={itemVariants} className="w-full">
              <LocationAutocomplete
                onLocationSelect={handleManualLocationSelect}
                currentLocation={null}
              />
            </motion.div>
          </motion.div>
        )}

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
                  <CardTitle className="text-2xl text-gradient-brand">
                    Just a few details...
                  </CardTitle>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <CardDescription className="text-pink-500 font-semibold">
                    What&apos;s the vibe for today?
                  </CardDescription>
                </motion.div>
              </CardHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <CardContent className="space-y-4">
                    <motion.div variants={itemVariants}>
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Theme / Category</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a date theme" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {placeCategoriesOptions}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <FormField
                        control={form.control}
                        name="budget"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Max Budget</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g., 250000"
                                {...field}
                                value={(field.value as string) ?? ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                    {remaining !== null && remaining > 0 && (
                      <motion.p
                        variants={itemVariants}
                        className="text-xs text-center text-gray-500"
                      >
                        You have{" "}
                        <span className="font-bold text-pink-500">
                          {remaining}
                        </span>{" "}
                        plans left. Sign-in for more date plans.
                      </motion.p>
                    )}

                    {remaining === 0 && (
                      <motion.div
                        variants={itemVariants}
                        className="text-center p-2 bg-yellow-100/50 border border-yellow-200 rounded-md"
                      >
                        <p className="text-xs text-yellow-700">
                          You&apos;ve used all your free plans. Please sign in
                          for more access.
                        </p>
                      </motion.div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full pt-4"
                    >
                      {remaining === 0 ? (
                        <Button type="button" className="w-full bg-gray-400">
                          <Lock className="mr-2 h-4 w-4" />
                          Sign in for More Plans
                        </Button>
                      ) : (
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full"
                        >
                          <Button
                            type="submit"
                            disabled={stage === "fetchingPlan"}
                            className="w-full bg-brand-pink hover:bg-pink-400 text-white font-bold"
                          >
                            {stage === "fetchingPlan" ? (
                              <KencanLoader />
                            ) : (
                              "Create My Itinerary"
                            )}
                          </Button>
                        </motion.div>
                      )}
                    </motion.div>
                  </CardFooter>
                </form>
              </Form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
