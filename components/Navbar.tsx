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
  FileText,
  FileSpreadsheet,
  Scale,
  Building2,
  Globe,
  LogIn,
  UserPlus,
  ChevronRight,
  Info,
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
  logo?: { url: string; src: string; alt: string };
  menu?: MenuItem[];
  auth?: {
    login: { text: string; url: string };
    signup: { text: string; url: string };
  };
}

const Navbar = ({
  logo = { url: "/", src: "/logo.png", alt: "logo" },
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
      ],
    },
    {
      title: "Forms",
      url: "#",
      items: [
        {
          title: "Immigration & USCIS Support",
          description: "Select a specific USCIS form to begin your application",
          icon: <FileText className="size-5 shrink-0 text-blue-500" />,
          url: "/forms/immigration-uscis-support",
          items: [
            {
              title: "Form I-90 – Green Card Replacement",
              icon: <Info className="size-4 text-blue-400" />,
              url: "/forms/immigration-uscis-support?form=form-i-90",
            },
            {
              title: "Form I-129f – Fiancé(E) / K-1 Visa",
              icon: <Info className="size-4 text-blue-400" />,
              url: "/forms/immigration-uscis-support?form=form-i-129f",
            },
            {
              title: "Form I-130 – Petition For Alien Relative",
              icon: <Info className="size-4 text-blue-400" />,
              url: "/forms/immigration-uscis-support?form=form-i-130",
            },
            {
              title: "Form I-130a – Spouse Beneficiary Information",
              icon: <Info className="size-4 text-blue-400" />,
              url: "/forms/immigration-uscis-support?form=form-i-130a",
            },
            {
              title: "Form I-131 – Travel Document / Advance Parole",
              icon: <Info className="size-4 text-blue-400" />,
              url: "/forms/immigration-uscis-support?form=form-i-131",
            },
            {
              title: "Form I-485 – Adjustment Of Status",
              icon: <Info className="size-4 text-blue-400" />,
              url: "/forms/immigration-uscis-support?form=form-i-485",
            },
            {
              title: "Form I-589 – Asylum Application",
              icon: <Info className="size-4 text-blue-400" />,
              url: "/forms/immigration-uscis-support?form=form-i-589",
            },
            {
              title: "Form I-751 – Remove Conditions On Green Card",
              icon: <Info className="size-4 text-blue-400" />,
              url: "/forms/immigration-uscis-support?form=form-i-751",
            },
            {
              title: "Form I-765 – Work Permit Application",
              icon: <Info className="size-4 text-blue-400" />,
              url: "/forms/immigration-uscis-support?form=form-i-765",
            },
            {
              title: "Form I-821 – Temporary Protected Status (TPS)",
              icon: <Info className="size-4 text-blue-400" />,
              url: "/forms/immigration-uscis-support?form=form-i-821",
            },
            {
              title: "Form I-864 – Affidavit Of Support (Sponsorship)",
              icon: <Info className="size-4 text-blue-400" />,
              url: "/forms/immigration-uscis-support?form=form-i-864",
            },
            {
              title: "Form N-400 – U.S. Citizenship (Naturalization)",
              icon: <Info className="size-4 text-blue-400" />,
              url: "/forms/immigration-uscis-support?form=form-n-400",
            },
            {
              title: "Form N-600 – Certificate Of Citizenship",
              icon: <Info className="size-4 text-blue-400" />,
              url: "/forms/immigration-uscis-support?form=form-n-600",
            },
          ],
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
    { title: "About", url: "/about" },
    { title: "Contact", url: "/contact" },
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
  const [activeValue, setActiveValue] = useState<string | undefined>(undefined);
  const [mobileAccordionValue, setMobileAccordionValue] = useState<
    string | undefined
  >(undefined);
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    // Detect Safari browser
    const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(
      navigator.userAgent,
    );
    setIsSafari(isSafariBrowser);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await authClient.getSession();
        if (session?.data?.user) setUser(session.data.user);
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
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const UserBadge = () => (
    <HoverCard openDelay={200} closeDelay={300}>
      <HoverCardTrigger asChild>
        <Button variant="ghost" className="p-0 h-auto hover:bg-transparent">
          <Avatar className="h-8 w-8 cursor-pointer rounded-lg">
            <AvatarImage
              src={user?.image}
              alt={user?.name || "User"}
              className="object-contain"
            />
            <AvatarFallback className="bg-gray-300 text-blue-500 text-sm rounded-lg">
              {getInitials(user?.name || user?.email || "User")}
            </AvatarFallback>
          </Avatar>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-56 p-2 z-50" align="end" sideOffset={5}>
        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 hover:bg-blue-100/60"
            onClick={() => {
              router.push("/dashboard");
              setIsOpen(false);
            }}
          >
            <LayoutDashboard className="h-4 w-4 text-blue-500" /> Dashboard
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 navbar-header",
        isScrolled
          ? isSafari
            ? "border-b bg-background py-2"
            : "border-b bg-background/80 backdrop-blur-md py-2"
          : "bg-transparent py-4",
      )}
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="hidden items-center justify-between lg:grid lg:grid-cols-3">
          <div className="flex items-center">
            <Link href={logo.url} className="flex items-center gap-2">
              <img src={logo.src} className="w-32" alt={logo.alt} />
            </Link>
          </div>
          <div className="flex justify-center">
            <NavigationMenu value={activeValue} onValueChange={setActiveValue}>
              <NavigationMenuList>
                {menu.map((item) => renderMenuItem(item, isSafari))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="flex justify-end gap-2">
            {isLoading ? (
              <div className="h-9 w-20 bg-gray-200 animate-pulse rounded" />
            ) : user ? (
              <UserBadge />
            ) : (
              <>
                <Button asChild variant="outline" size="sm" className="gap-2">
                  <Link href={auth.login.url}>
                    <LogIn className="size-4" />
                    Log in
                  </Link>
                </Button>
                <Button
                  asChild
                  className="bg-blue-500 gap-2 hover:bg-blue-600"
                  size="sm"
                >
                  <Link href={auth.signup.url}>
                    <UserPlus className="size-4" />
                    Sign up
                  </Link>
                </Button>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <Link href={logo.url}>
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
                className="w-full sm:max-w-none overflow-y-auto px-6 z-50"
              >
                <SheetHeader>
                  <SheetTitle>
                    <Link href={logo.url} onClick={() => setIsOpen(false)}>
                      <img src={logo.src} className="w-20" alt={logo.alt} />
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="my-8 flex flex-col gap-8">
                  <Accordion
                    type="single"
                    collapsible
                    value={mobileAccordionValue}
                    onValueChange={setMobileAccordionValue}
                    className="w-full flex flex-col gap-4"
                  >
                    {menu.map((item) => renderMobileMenuItem(item, setIsOpen))}
                  </Accordion>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

const renderMenuItem = (item: MenuItem, isSafari: boolean = false) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title} value={item.title}>
        <NavigationMenuTrigger className="text-muted-foreground">
          {item.title}
        </NavigationMenuTrigger>
        <NavigationMenuContent className="z-50">
          <ul className="w-80 p-3 flex flex-col gap-1">
            {item.items.map((subItem) => (
              <li key={subItem.title}>
                {subItem.items ? (
                  <HoverCard openDelay={200} closeDelay={300}>
                    <HoverCardTrigger asChild>
                      <Link
                        href={subItem.url || "#"}
                        className="flex items-center justify-between select-none gap-4 rounded-md p-3 transition-colors hover:bg-blue-100/60 cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          {subItem.icon}
                          <div>
                            <div className="text-sm font-semibold">
                              {subItem.title}
                            </div>
                            {subItem.description && (
                              <p className="text-[10px] text-muted-foreground leading-tight">
                                {subItem.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="size-4 text-muted-foreground" />
                      </Link>
                    </HoverCardTrigger>
                    <HoverCardContent
                      side="right"
                      align="start"
                      className={cn(
                        "w-80 p-2 ml-1 max-h-[450px] overflow-y-auto shadow-xl border-blue-50 z-50",
                        !isSafari && "bg-white/95 backdrop-blur-sm",
                      )}
                      sideOffset={5}
                    >
                      <div className="grid gap-1">
                        {subItem.items.map((deepItem) => (
                          <Link
                            key={deepItem.title}
                            href={deepItem.url}
                            className="flex items-center gap-3 text-xs text-gray-700 p-3 rounded-md overflow-hidden hover:bg-blue-50 transition-all border-l-2 border-transparent hover:border-blue-500 group"
                          >
                            <span className="shrink-0 transition-transform group-hover:scale-110">
                              {deepItem.icon || (
                                <Info className="size-3 text-blue-400" />
                              )}
                            </span>
                            <span className="font-bold text-slate-700">
                              {deepItem.title}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                ) : (
                  <NavigationMenuLink asChild>
                    <Link
                      className="flex flex-row items-center select-none gap-4 rounded-md p-3 transition-colors hover:bg-blue-100/60"
                      href={subItem.url}
                    >
                      {subItem.icon}
                      <div>
                        <div className="text-sm font-semibold">
                          {subItem.title}
                        </div>
                        {subItem.description && (
                          <p className="text-xs text-muted-foreground">
                            {subItem.description}
                          </p>
                        )}
                      </div>
                    </Link>
                  </NavigationMenuLink>
                )}
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
          className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-accent-foreground"
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
        <AccordionTrigger className="py-2 text-lg font-semibold">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2 flex flex-col gap-2">
          {item.items.map((subItem) =>
            subItem.items ? (
              <Accordion
                type="single"
                collapsible
                key={subItem.title}
                className="w-full"
              >
                <AccordionItem value={subItem.title} className="border-b-0">
                  <AccordionTrigger className="p-3 hover:bg-blue-50 rounded-md">
                    <div className="flex items-center gap-4 text-left">
                      {subItem.icon}
                      <span className="text-sm font-semibold">
                        {subItem.title}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pl-8 flex flex-col gap-2 pt-1">
                    {subItem.items.map((deepItem) => (
                      <Link
                        key={deepItem.title}
                        href={deepItem.url}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 py-3 px-2 text-xs text-muted-foreground hover:text-blue-500 border-b border-gray-50 last:border-0"
                      >
                        {deepItem.icon || <Info className="size-3" />}
                        {deepItem.title}
                      </Link>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ) : (
              <Link
                key={subItem.title}
                className="flex items-center gap-4 rounded-md p-3 hover:bg-blue-100/60"
                href={subItem.url}
                onClick={() => setIsOpen(false)}
              >
                {subItem.icon}
                <div>
                  <div className="text-sm font-semibold">{subItem.title}</div>
                  {subItem.description && (
                    <p className="text-xs text-muted-foreground">
                      {subItem.description}
                    </p>
                  )}
                </div>
              </Link>
            ),
          )}
        </AccordionContent>
      </AccordionItem>
    );
  }
  return (
    <Link
      key={item.title}
      href={item.url}
      className="py-2 text-lg font-semibold"
      onClick={() => setIsOpen(false)}
    >
      {item.title}
    </Link>
  );
};

export { Navbar };
