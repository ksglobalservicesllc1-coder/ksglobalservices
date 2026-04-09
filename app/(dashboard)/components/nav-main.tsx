"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  Home,
  Timer,
  CalendarPlus,
  CalendarDays,
  UserRoundCog,
  ChevronRight,
} from "lucide-react";

import { authClient } from "@/lib/auth/auth-client";

export function NavMain() {
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  const role = session?.user?.role;

  // Added transition-colors and duration-200 for the smooth effect
  const getClass = (path: string) =>
    `transition-colors duration-100 ${
      pathname === path
        ? "bg-blue-700 text-white"
        : "hover:bg-blue-600 hover:text-white"
    }`;

  if (isPending) return null;

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {/* OVERVIEW */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild className={getClass("/dashboard")}>
              <Link href="/dashboard">
                <Home />
                <span>Overview</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* ADMIN + SUPER ADMIN SECTION */}
          {(role === "super-admin" || role === "admin") && (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={getClass("/admin/events")}
                >
                  <Link href="/admin/events">
                    <CalendarPlus />
                    <span>Services</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={getClass("/admin/schedule")}
                >
                  <Link href="/admin/schedule">
                    <CalendarDays />
                    <span>Schedule</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* COLLAPSIBLE BOOKINGS */}
              <Collapsible asChild className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip="Bookings"
                      className="transition-colors duration-200"
                    >
                      <Timer />
                      <span>Bookings</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          className={getClass("/admin/bookings")}
                        >
                          <Link href="/admin/bookings">
                            <span>My Bookings</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>

                      {role === "super-admin" && (
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            className={getClass("/admin/all-bookings")}
                          >
                            <Link href="/admin/all-bookings">
                              <span>All Bookings</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </>
          )}

          {/* USER ONLY */}
          {role === "user" && (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className={getClass("/client/bookings")}
              >
                <Link href="/client/bookings">
                  <Timer />
                  <span>My Bookings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          {/* SUPER ADMIN ONLY - MANAGE TEAM */}
          {role === "super-admin" && (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className={getClass("/admin/manageAdmin")}
              >
                <Link href="/admin/manageAdmin">
                  <UserRoundCog />
                  <span>Manage Team</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
