"use client";

import Link from "next/link";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Home, Package, ShoppingCart } from "lucide-react";

export function NavMain() {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {/* Overview */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Overview
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Products */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href="/dashboard/products"
                className="flex items-center gap-2"
              >
                <Package className="h-4 w-4" />
                Products
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Orders */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href="/dashboard/orders"
                className="flex items-center gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                Orders
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
