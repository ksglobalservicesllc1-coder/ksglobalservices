"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel, // Switched to FormLabel
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormType = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const form = useForm<ForgotPasswordFormType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordFormType) => {
    setLoading(true);
    try {
      const { error } = await authClient.requestPasswordReset({
        email: values.email,
        redirectTo: "/auth/reset-password",
      });

      if (error) {
        toast.error(error.message || "Something went wrong");
        return;
      }

      toast.success("Check your email for the password reset link!");
      form.reset();
    } catch (err) {
      console.error("Forgot password error:", err);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-md mx-auto mt-40 space-y-6 p-6 border rounded shadow"
      >
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold">Forgot Password</h2>
          <p className="text-sm text-muted-foreground">
            Enter your email to receive a reset link
          </p>
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="name@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2 text-sm">
              <Loader2 className="animate-spin h-4 w-4" />
              Sending...
            </span>
          ) : (
            "Send Reset Link"
          )}
        </Button>
        <Button
          type="button"
          variant="link"
          onClick={() => router.push("/auth/sign-in")}
          className="w-full cursor-pointer"
        >
          Back to Sign-in Page
        </Button>
      </form>
    </Form>
  );
}
