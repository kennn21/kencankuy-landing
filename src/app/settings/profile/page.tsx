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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { kencanApi } from "@/lib/api-list";

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
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Update failed", {
        description: (error as { message: string }).message,
      });
    }
  };

  if (!isReady) {
    return <p>Loading profile...</p>;
  }

  if (!user) {
    return <p>Please log in to view your profile.</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
        <CardDescription>
          Manage your personal and partner&apos;s information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="partnerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Partner&apos;s Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your partner's name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="partnerEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Partner&apos;s Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your partner's email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="bg-brand-pink hover:bg-pink-400"
            >
              {form.formState.isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
