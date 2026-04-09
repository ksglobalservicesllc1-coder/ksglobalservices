"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import { signingSchema, SignIngType } from "@/lib/schemas/signing.schema";
import { authClient } from "@/lib/auth/auth-client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

export default function signin() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  // 1.Add mounted state to prevent hydration mismatch
  const [mounted, setMounted] = useState(false);

  // Prevent the user to access this page if they are already logged in
  useEffect(() => {
    const checkSession = async () => {
      const session = await authClient.getSession();

      if (session?.data?.user) {
        router.push("/dashboard");
      }
    };

    checkSession();
  }, [router]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const form = useForm<SignIngType>({
    resolver: zodResolver(signingSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignIngType) => {
    setLoading(true);
    try {
      const response = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if (response.data?.user) {
        toast.success("Login Successful!", {
          autoClose: 1000,
        });
        router.replace("/dashboard");
        form.reset();
      } else {
        toast.error(response.error?.message || "Failed to login");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  const handleForgetPassword = () => {
    router.push("/auth/forgot-password");
  };

  // 2.Prevent rendering until the client has mounted
  if (!mounted) {
    return null;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-2">
      <Card className="w-full max-w-sm shadow">
        <CardHeader className="text-center my-[-10px]">
          <CardTitle className="text-xl font-bold">
            Connect To Your Account
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-sm mb-[-3px]">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                      />
                    </FormControl>
                    <div className="flex items-center gap-1 text-sm text-red-500">
                      {fieldState.error && (
                        <>
                          <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-[-4px]" />
                          <FormMessage className="leading-none" />
                        </>
                      )}
                    </div>
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel className="text-sm mb-[-3px]">
                        Password
                      </FormLabel>
                      <span
                        onClick={() => handleForgetPassword()}
                        className="text-xs text-gray-500 hover:text-gray-700 mb-[-3px] underline cursor-pointer"
                      >
                        Forget password?
                      </span>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="********"
                          {...field}
                        />
                        <span
                          className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </span>
                      </div>
                    </FormControl>
                    <div className="flex items-center gap-1 text-sm text-red-500">
                      {fieldState.error && (
                        <>
                          <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-[-4px]" />
                          <FormMessage className="leading-none" />
                        </>
                      )}
                    </div>
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-9 cursor-pointer"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2 text-sm">
                    <Loader2 className="animate-spin h-4 w-4" />
                    Signing In...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>

              {/* OAuth Buttons */}
              <div className="flex flex-col gap-2 mt-1">
                <div className="relative flex items-center my-2">
                  <span className="flex-grow border-t border-gray-300" />
                  <span className="mx-2 text-xs text-gray-500 bg-white px-1">
                    Or Sign-in With
                  </span>
                  <span className="flex-grow border-t border-gray-300" />
                </div>

                <div className="flex gap-2 text-sm">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full flex-1 items-center justify-center gap-2 h-9 cursor-pointer"
                    onClick={async () => {
                      try {
                        await authClient.signIn.social({
                          provider: "google",
                          callbackURL: "/dashboard",
                        });
                      } catch (error) {
                        toast.error("Google sign-in failed. Please try again.");
                      }
                    }}
                  >
                    <img src="/google.svg" className="w-4 h-4" alt="google" />
                    <span>Google</span>
                  </Button>
                </div>
              </div>

              {/* Sign In Link */}
              <p className="text-center text-xs text-gray-500 mt-1">
                Don't have an account?{" "}
                <Link
                  href="/auth/sign-up"
                  className="text-blue-600 hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
