"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CldUploadWidget } from "next-cloudinary";
import { FiCamera } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createAdmin } from "@/app/actions/manageAdminsAction";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  image: z.string().optional(),
});

export default function CreateAdminForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", password: "", image: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("password", values.password);
    if (values.image) formData.append("image", values.image);

    await createAdmin(formData);
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem className="flex flex-col items-center justify-center space-y-4 pt-2">
              <div className="relative group">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-slate-50 bg-slate-100 flex items-center justify-center transition-all group-hover:border-primary/20 shadow-inner">
                  {field.value ? (
                    <img
                      src={field.value}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-slate-400 flex flex-col items-center">
                      <FiCamera className="w-8 h-8 mb-1" />
                      <span className="text-[10px] font-semibold uppercase">
                        Upload
                      </span>
                    </div>
                  )}
                </div>
                <CldUploadWidget
                  signatureEndpoint="/api/upload-image"
                  onSuccess={(result: any) => {
                    const url = result?.info?.secure_url;
                    if (url) form.setValue("image", url, { shouldDirty: true });
                  }}
                >
                  {({ open }) => (
                    <button
                      type="button"
                      onClick={() => open()}
                      className="absolute bottom-1 right-1 p-2 bg-primary text-white rounded-full shadow-lg hover:scale-110 transition-transform active:scale-95 border-2 border-white"
                    >
                      <FiCamera className="w-4 h-4" />
                    </button>
                  )}
                </CldUploadWidget>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-600 font-medium">
                  Full Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Jane Doe"
                    className="h-11 bg-slate-50/50 border-slate-200 focus:bg-white transition-all"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-600 font-medium">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="admin@example.com"
                      className="h-11 bg-slate-50/50 border-slate-200"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-600 font-medium">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="h-11 bg-slate-50/50 border-slate-200"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-12 text-base font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
        >
          Create Account
        </Button>
      </form>
    </Form>
  );
}
