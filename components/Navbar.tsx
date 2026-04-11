"use client";

import * as React from "react";
import {
  Menu,
  LogOut,
  LayoutDashboard,
  UserCheck,
  Calculator,
  Stamp,
  Briefcase,
  Languages,
  PlusCircle,
  FileText,
  FileSpreadsheet,
  Scale,
  Building2,
  Globe,
  MoreHorizontal,
  LogIn,
  UserPlus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { createSlug } from "@/lib/slug";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface NavbarProps {
  logo?: {
    url: string;
    src: string;
    alt: string;
  };
  menu?: MenuItem[];
  auth?: {
    login: {
      text: string;
      url: string;
    };
    signup: {
      text: string;
      url: string;
    };
  };
}

const Navbar = ({
  logo = {
    url: "/",
    src: "/logo.png",
    alt: "logo",
  },
  menu = [
    {
      title: "Appointments",
      url: "#",
      items: [
        {
          title: "Immigration & USCIS Support",
          description: "Schedule a consultation for USCIS application guidance",
          icon: <UserCheck className="size-5 shrink-0 text-blue-500" />,
          url: `/admins/${createSlug("Immigration USCIS Support")}`,
        },
        {
          title: "Tax & Financial Services",
          description:
            "Book an appointment for tax prep and financial planning",
          icon: <Calculator className="size-5 shrink-0 text-blue-500" />,
          url: `/admins/${createSlug("Tax Financial Services")}`,
        },
        {
          title: "Notary & Document Services",
          description: "Set a time for official document notarization",
          icon: <Stamp className="size-5 shrink-0 text-blue-500" />,
          url: `/admins/${createSlug("Notary Document Services")}`,
        },
        {
          title: "Business & Administrative Services",
          description: "Consult with us regarding business setup and admin",
          icon: <Briefcase className="size-5 shrink-0 text-blue-500" />,
          url: `/admins/${createSlug("Business Administrative Services")}`,
        },
        {
          title: "Translation & Language Services",
          description: "Book a professional interpreter or translator",
          icon: <Languages className="size-5 shrink-0 text-blue-500" />,
          url: `/admins/${createSlug("Translation Language Services")}`,
        },
        {
          title: "Other Services",
          description: "Schedule a meeting for custom service requests",
          icon: <PlusCircle className="size-5 shrink-0 text-blue-500" />,
          url: `/admins/${createSlug("Other Services")}`,
        },
      ],
    },
    {
      title: "Forms",
      url: "#",
      items: [
        {
          title: "Immigration & USCIS Support",
          description: "Access and complete your USCIS immigration forms",
          icon: <FileText className="size-5 shrink-0 text-blue-500" />,
          url: `/forms/${createSlug("Immigration USCIS Support")}`,
        },
        {
          title: "Tax & Financial Services",
          description: "Fill out necessary tax documents and financial forms",
          icon: <FileSpreadsheet className="size-5 shrink-0 text-blue-500" />,
          url: `/forms/${createSlug("Tax Financial Services")}`,
        },
        {
          title: "Notary & Document Services",
          description: "Prepare your documents for legal notarization",
          icon: <Scale className="size-5 shrink-0 text-blue-500" />,
          url: `/forms/${createSlug("Notary Document Services")}`,
        },
        {
          title: "Business & Administrative Services",
          description: "Business registration and administrative paperwork",
          icon: <Building2 className="size-5 shrink-0 text-blue-500" />,
          url: `/forms/${createSlug("Business Administrative Services")}`,
        },
        {
          title: "Translation & Language Services",
          description: "Submit documents for certified translation services",
          icon: <Globe className="size-5 shrink-0 text-blue-500" />,
          url: `/forms/${createSlug("Translation Language Services")}`,
        },
      ],
    },
    {
      title: "About",
      url: "/about",
    },
    {
      title: "Contact",
      url: "/contact",
    },
  ],
  auth = {
    login: { text: "Log in", url: "/auth/sign-in" },
    signup: { text: "Sign up", url: "/auth/sign-up" },
  },
}: NavbarProps) => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll for sticky backdrop effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await authClient.getSession();
        if (session?.data?.user) {
          setUser(session.data.user);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      setUser(null);
      setIsOpen(false);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n)
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const UserBadge = () => (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Button variant="ghost" className="p-0 h-auto hover:bg-transparent">
          <Avatar className="h-8 w-8 cursor-pointer rounded-lg">
            <AvatarImage
              src={user?.image}
              alt={user?.name || "User avatar"}
              className="object-contain"
            />
            <AvatarFallback className="bg-gray-300 text-blue-500 text-sm rounded-lg">
              {getInitials(user?.name || user?.email || "User")}
            </AvatarFallback>
          </Avatar>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-56 p-2" align="end">
        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 cursor-pointer hover:bg-blue-100/60"
            onClick={() => {
              router.push("/dashboard");
              setIsOpen(false);
            }}
          >
            <LayoutDashboard className="h-4 w-4 text-blue-500" />
            Dashboard
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-red-600 hover:text-red-600 hover:bg-red-50 cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );

  const AuthButtons = () => (
    <>
      <Button asChild variant="outline" size="sm" className="gap-2">
        <Link href={auth.login.url}>
          <LogIn className="size-4" />
          {auth.login.text}
        </Link>
      </Button>
      <Button asChild className="bg-blue-500 gap-2 hover:bg-blue-600" size="sm">
        <Link href={auth.signup.url}>
          <UserPlus className="size-4" />
          {auth.signup.text}
        </Link>
      </Button>
    </>
  );

  if (isLoading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container py-4">
          <nav className="hidden items-center justify-between lg:grid lg:grid-cols-3">
            <div className="flex items-center">
              <Link href={logo.url} className="flex items-center gap-2">
                <img src={logo.src} className="w-30" alt={logo.alt} />
              </Link>
            </div>
            <div className="flex justify-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
            <div className="flex justify-end gap-2">
              <div className="h-9 w-20 bg-gray-200 animate-pulse rounded" />
              <div className="h-9 w-20 bg-gray-200 animate-pulse rounded" />
            </div>
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "border-b bg-background/80 backdrop-blur-md py-2"
          : "bg-transparent py-4",
      )}
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Navigation */}
        <nav className="hidden items-center justify-between lg:grid lg:grid-cols-3">
          <div className="flex items-center">
            <Link href={logo.url} className="flex items-center gap-2">
              <img src={logo.src} className="w-30" alt={logo.alt} />
            </Link>
          </div>

          <div className="flex justify-center">
            <NavigationMenu>
              <NavigationMenuList>
                {menu.map((item) => renderMenuItem(item))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex justify-end gap-2">
            {user ? <UserBadge /> : <AuthButtons />}
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <Link href={logo.url} className="flex items-center gap-2">
              <img src={logo.src} className="w-20" alt={logo.alt} />
            </Link>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full sm:max-w-none overflow-y-auto px-6"
              >
                <SheetHeader>
                  <SheetTitle>
                    <Link
                      href={logo.url}
                      className="flex items-center gap-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <img src={logo.src} className="w-20" alt={logo.alt} />
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="my-8 flex flex-col gap-8">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {menu.map((item) => renderMobileMenuItem(item, setIsOpen))}
                  </Accordion>

                  <div className="flex flex-col gap-3 pt-4 border-t">
                    {user ? (
                      <>
                        <div className="flex items-center gap-3 px-3 py-2 bg-muted">
                          <Avatar className="h-10 w-10 rounded-lg">
                            <AvatarImage
                              src={user?.image}
                              alt={user?.name || "User"}
                              className="object-cover"
                            />
                            <AvatarFallback className="font-medium bg-gray-300 text-blue-500 rounded-lg">
                              {getInitials(user?.name || user?.email || "User")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm font-medium truncate">
                              {user?.name || "User"}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {user?.email}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          className="w-full justify-start gap-2 hover:bg-blue-100/60"
                          onClick={() => {
                            router.push("/dashboard");
                            setIsOpen(false);
                          }}
                        >
                          <LayoutDashboard className="h-4 w-4 text-blue-500" />
                          Dashboard
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start gap-2 text-red-600 hover:text-red-600 hover:bg-red-50"
                          onClick={handleLogout}
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          asChild
                          variant="outline"
                          className="w-full gap-2"
                          onClick={() => setIsOpen(false)}
                        >
                          <Link href={auth.login.url}>
                            <LogIn className="size-4" />
                            {auth.login.text}
                          </Link>
                        </Button>

                        <Button
                          asChild
                          className="w-full gap-2 bg-blue-500 hover:bg-blue-600"
                          onClick={() => setIsOpen(false)}
                        >
                          <Link href={auth.signup.url}>
                            <UserPlus className="size-4" />
                            {auth.signup.text}
                          </Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger className="text-muted-foreground">
          {item.title}
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="w-80 p-3">
            {item.items.map((subItem) => (
              <li key={subItem.title}>
                <NavigationMenuLink asChild>
                  <Link
                    className="flex flex-row items-center select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-100/60 hover:text-accent-foreground"
                    href={subItem.url}
                  >
                    {subItem.icon}
                    <div>
                      <div className="text-sm font-semibold">
                        {subItem.title}
                      </div>
                      {subItem.description && (
                        <p className="text-sm leading-snug text-muted-foreground">
                          {subItem.description}
                        </p>
                      )}
                    </div>
                  </Link>
                </NavigationMenuLink>
              </li>
            ))}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink asChild>
        <Link
          className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-accent-foreground"
          href={item.url}
        >
          {item.title}
        </Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (
  item: MenuItem,
  setIsOpen: (open: boolean) => void,
) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="py-2 text-lg font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2 flex flex-col gap-2">
          {item.items.map((subItem) => (
            <Link
              key={subItem.title}
              className="flex justify-start items-center select-none gap-4 rounded-md p-3 leading-none outline-none transition-colors hover:bg-blue-100/60 hover:text-accent-foreground"
              href={subItem.url}
              onClick={() => setIsOpen(false)}
            >
              {subItem.icon}
              <div>
                <div className="text-sm font-semibold text-left">
                  {subItem.title}
                </div>
                {subItem.description && (
                  <p className="text-sm leading-snug text-muted-foreground text-left">
                    {subItem.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <a
      key={item.title}
      href={item.url}
      className="py-2 text-lg font-semibold border-b-0"
      onClick={() => setIsOpen(false)}
    >
      {item.title}
    </a>
  );
};

export { Navbar };
