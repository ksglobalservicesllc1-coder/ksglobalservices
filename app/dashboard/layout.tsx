"use client";

import { AppSidebar } from "../dashboard/components/app-sidebar";
import { AppHeader } from "../dashboard/components/app-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React, { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session?.user) {
      redirect("/auth/sign-in");
    }
  }, [session, isPending]);

  if (isPending || !session?.user) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 50)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <AppHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <main>{children}</main>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
