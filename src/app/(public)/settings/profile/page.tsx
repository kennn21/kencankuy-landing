"use client";

import { useAuth } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, User, Heart, Mail, Save, Sparkles } from "lucide-react";
import { kencanApi } from "@/lib/api-list";
import KencanLoader from "@/components/global/KencanLoader";

const profileFormSchema = z.object({
  name: z.string().min(1, "Name is required."),
  partnerName: z.string().optional(),
  partnerEmail: z
    .string()
    .email("Invalid email address.")
    .optional()
    .or(z.literal("")),
});

async function updateUserProfile(data: z.infer<typeof profileFormSchema>) {
  try {
    const response = await kencanApi.users.updateProfile.call({ data });
    return response;
  } catch (error) {
    console.error(error);
    throw new Error(
      (error as { message: string }).message || "Failed to update profile."
    );
  }
}

export default function ProfilePage() {
  const { user, isReady, profile } = useAuth();

  // 1. Provide default values to useForm
  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      partnerName: "",
      partnerEmail: "",
    },
  });

  // 2. Use form.reset() to update the form values once the profile is loaded
  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name || "",
        partnerName: profile.partnerName || "",
        partnerEmail: profile.partnerEmail || "",
      });
    }
  }, [profile, form]);

  const onSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    if (!user) {
      toast.error("You must be logged in to update your profile.");
      return;
    }

    try {
      await updateUserProfile(values);
      toast.success("Profile updated successfully!", {
        description: "Your changes have been saved.",
      });
    } catch (error) {
      toast.error("Update failed", {
        description: (error as { message: string }).message,
      });
    }
  };

  if (!isReady) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-brand-primary rounded-full blur-xl opacity-20 animate-pulse"></div>
          <Loader2 className="relative h-12 w-12 animate-spin text-brand-pink-500" />
        </div>
        <p className="mt-4 text-gray-600 animate-pulse">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <Card className="m-6 border-0 shadow-brand-lg bg-gradient-bg-card">
        <CardContent className="text-center p-12">
          <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Authentication Required
          </h3>
          <p className="text-gray-500">
            Please log in to view and manage your profile.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Profile Header */}
      <div className="text-center pb-6 border-b border-gray-100">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-brand-primary rounded-full mb-4 shadow-brand-lg">
          <User className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold font-playfair text-gradient-brand mb-2">
          Profile Settings
        </h1>
        <p className="text-gray-600">
          Manage your personal and partner&apos;s information for better date
          planning
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Information Card */}
        <Card className="border-0 shadow-brand bg-white/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-brand-primary rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Personal Information</CardTitle>
                <CardDescription>
                  Your basic information for the account
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Your Name *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your name"
                          {...field}
                          className="border-brand-pink-200 focus:border-brand-pink-400 focus:ring-brand-pink-400/20"
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-gray-500">
                        This will be used in your date plans and communications
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Partner Information Card */}
        <Card className="border-0 shadow-brand bg-white/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-brand-secondary rounded-full flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Partner Information</CardTitle>
                <CardDescription>
                  Optional details about your special someone
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="partnerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Partner&apos;s Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your partner's name"
                          {...field}
                          className="border-brand-pink-200 focus:border-brand-pink-400 focus:ring-brand-pink-400/20"
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-gray-500">
                        This helps personalize your date plans
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="partnerEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Partner&apos;s Email
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Enter your partner's email"
                            {...field}
                            className="border-brand-pink-200 focus:border-brand-pink-400 focus:ring-brand-pink-400/20 pl-10"
                          />
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                      </FormControl>
                      <FormDescription className="text-xs text-gray-500">
                        For sharing date plans and invitations
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Save Button Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-gradient-bg-light rounded-xl border border-brand-pink-200">
        <div className="flex items-center space-x-3 mb-4 sm:mb-0">
          <Sparkles className="h-5 w-5 text-brand-pink-500" />
          <div>
            <p className="font-medium text-gray-800">
              Ready to save your changes?
            </p>
            <p className="text-sm text-gray-600">
              Your profile will be updated instantly
            </p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              variant="love"
              size="lg"
              className="min-w-[140px]"
            >
              {form.formState.isSubmitting ? (
                <>
                  <KencanLoader />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>

      {/* Help Section */}
      <Card className="border border-brand-pink-200 bg-gradient-bg-dawn">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-brand-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Heart className="h-6 w-6 text-brand-pink-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">
                💡 Profile Tips
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>
                  • Adding your partner&apos;s info helps create more
                  personalized date suggestions
                </li>
                <li>
                  • Your email is secure and only used for account management
                </li>
                <li>
                  • Partner&apos;s email enables sharing date plans directly
                  with them
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
