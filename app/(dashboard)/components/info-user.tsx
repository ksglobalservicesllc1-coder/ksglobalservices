"use client";

import {
  IconDotsVertical,
  IconLogout,
  IconUserCircle,
} from "@tabler/icons-react";

import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth/auth-client";

type NavUserProps = {
  user?: {
    name: string;
    email: string;
    avatar: string;
  };
};

export function InfoUser({ user }: NavUserProps) {
  if (!user) return null;

  const { data: session, isPending } = authClient.useSession();
  const role = session?.user?.role;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.replace("/auth/sign-in");
    router.refresh();
  };

  const handleAccount = async () => {
    router.push("admin/profile");
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  className="object-contain"
                  src={user.avatar}
                  alt={user.name}
                />
                <AvatarFallback className="rounded-lg bg-gray-300 text-blue-500 font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="sm:grid sm:flex-1 hidden text-left text-sm leading-tight ">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>

              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side="bottom"
            align="end"
            sideOffset={4}
          >
            {(role === "super-admin" || role === "admin") && (
              <DropdownMenuItem
                onSelect={handleAccount}
                className="cursor-pointer"
              >
                <IconUserCircle className="size-4" />
                Profile
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onSelect={handleLogout}
              variant="destructive"
              className="cursor-pointer"
            >
              <IconLogout className="size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
