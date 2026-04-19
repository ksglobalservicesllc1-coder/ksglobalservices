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
  ChevronRight,
  ChevronDown,
  Info,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";
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
          url: "#",
          items: [
            {
              title: "Form I-90 – Green Card Replacement",
              url: "/forms/immigration-uscis-support?form=form-i-90",
            },
            {
              title: "Form I-129f – Fiancé(E) / K-1 Visa",
              url: "/forms/immigration-uscis-support?form=form-i-129f",
            },
            {
              title: "Form I-130 – Petition For Alien Relative",
              url: "/forms/immigration-uscis-support?form=form-i-130",
            },
            {
              title: "Form I-130a – Spouse Beneficiary Information",
              url: "/forms/immigration-uscis-support?form=form-i-130a",
            },
            {
              title: "Form I-131 – Travel Document / Advance Parole",
              url: "/forms/immigration-uscis-support?form=form-i-131",
            },
            {
              title: "Form I-485 – Adjustment Of Status",
              url: "/forms/immigration-uscis-support?form=form-i-485",
            },
            {
              title: "Form I-589 – Asylum Application",
              url: "/forms/immigration-uscis-support?form=form-i-589",
            },
            {
              title: "Form I-751 – Remove Conditions On Green Card",
              url: "/forms/immigration-uscis-support?form=form-i-751",
            },
            {
              title: "Form I-765 – Work Permit Application",
              url: "/forms/immigration-uscis-support?form=form-i-765",
            },
            {
              title: "Form I-821 – Temporary Protected Status (TPS)",
              url: "/forms/immigration-uscis-support?form=form-i-821",
            },
            {
              title: "Form I-864 – Affidavit Of Support (Sponsorship)",
              url: "/forms/immigration-uscis-support?form=form-i-864",
            },
            {
              title: "Form N-400 – U.S. Citizenship (Naturalization)",
              url: "/forms/immigration-uscis-support?form=form-n-400",
            },
            {
              title: "Form N-600 – Certificate Of Citizenship",
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openMobileMenus, setOpenMobileMenus] = useState<string[]>([]);

  const toggleMobileMenu = (title: string) => {
    setOpenMobileMenus((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
    );
  };

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
      setIsMobileMenuOpen(false);
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

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "border-b bg-white/95 backdrop-blur-md py-2 shadow-sm"
          : "bg-transparent py-4",
      )}
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between lg:grid lg:grid-cols-3">
          {/* Logo */}
          <div className="flex items-center">
            <Link href={logo.url} className="flex items-center gap-2">
              <img
                src={logo.src}
                className="w-24 md:w-32 transition-all"
                alt={logo.alt}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex justify-center">
            <ul className="flex items-center gap-1">
              {menu.map((item) => (
                <li key={item.title} className="relative group">
                  <Link
                    href={item.url}
                    className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 rounded-lg transition-colors group-hover:bg-blue-50/50"
                  >
                    {item.title}
                    {item.items && (
                      <ChevronDown className="size-4 opacity-50 group-hover:rotate-180 transition-transform" />
                    )}
                  </Link>

                  {item.items && (
                    /* Level 1 Dropdown Container */
                    <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-">
                      <div className="w-80 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-slate-100 p-2">
                        {item.items.map((subItem) => (
                          <div
                            key={subItem.title}
                            className="relative group/sub"
                          >
                            <Link
                              href={subItem.url}
                              className="flex items-center justify-between gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                {subItem.icon}
                                <div>
                                  <div className="text-sm font-bold text-slate-800">
                                    {subItem.title}
                                  </div>
                                  {subItem.description && (
                                    <p className="text-[10px] text-slate-500 leading-tight">
                                      {subItem.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                              {subItem.items && (
                                <ChevronRight className="size-4 text-slate-400 group-hover/sub:translate-x-1 transition-transform" />
                              )}
                            </Link>

                            {/* Level 2 Sub-menu (Flyout) */}
                            {subItem.items && (
                              <div className="absolute left-full top-0 pl-2 opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-200">
                                <div className="w-72 bg-white rounded-xl shadow-[10px_10px_40px_rgba(0,0,0,0.12)] border border-slate-100 p-2 max-h-[450px] overflow-y-auto custom-scrollbar">
                                  {subItem.items.map((deepItem) => (
                                    <Link
                                      key={deepItem.title}
                                      href={deepItem.url}
                                      className="flex items-center gap-3 p-2.5 text-[11px] font-bold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all border-l-2 border-transparent hover:border-blue-500"
                                    >
                                      <Info className="size-3 text-blue-400 shrink-0" />
                                      {deepItem.title}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* User Auth Section */}
          <div className="hidden lg:flex justify-end items-center gap-3">
            {isLoading ? (
              <div className="h-9 w-20 bg-slate-100 animate-pulse rounded-lg" />
            ) : user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-colors">
                  <div className="h-9 w-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm overflow-hidden">
                    {user?.image ? (
                      <img
                        src={user.image}
                        alt="Avatar"
                        className="h-full w-full object-cover object-top"
                      />
                    ) : (
                      getInitials(user?.name || user?.email)
                    )}
                  </div>
                </button>
                <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-">
                  <div className="w-48 bg-white rounded-xl shadow-xl border border-slate-100 p-1">
                    <button
                      onClick={() => router.push("/dashboard")}
                      className="flex items-center gap-2 w-full cursor-pointer p-2.5 text-sm font-semibold text-slate-700 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <LayoutDashboard className="size-4 text-blue-500" />{" "}
                      Dashboard
                    </button>
                    <hr className="my-1 border-slate-100" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full cursor-pointer p-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut className="size-4" /> Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href={auth.login.url}
                  className="text-sm font-bold text-slate-600 hover:text-blue-600 px-4 cursor-pointer"
                >
                  Log in
                </Link>
                <Link
                  href={auth.signup.url}
                  className="bg-blue-600 text-white text-sm font-bold cursor-pointer px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all shadow-md shadow-blue-100"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile UI (Remains same as previous update) */}
          <div className="lg:hidden flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-slate-600 bg-slate-100 rounded-lg"
            >
              <Menu className="size-6" />
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer */}
      <div
        className={cn(
          "fixed inset-0 z-10 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible",
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <div
        className={cn(
          "fixed inset-y-0 right-0 z- w-full max-w-sm bg-white transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] lg:hidden",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-5 border-b">
            <img src={logo.src} className="w-20" alt={logo.alt} />
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-slate-400 bg-slate-50 rounded-full"
            >
              <X className="size-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <ul className="space-y-1">
              {menu.map((item) => (
                <li key={item.title} className="py-1">
                  {item.items ? (
                    <div className="space-y-1">
                      <button
                        onClick={() => toggleMobileMenu(item.title)}
                        className={cn(
                          "flex items-center justify-between w-full p-3.5 rounded-xl transition-all",
                          openMobileMenus.includes(item.title)
                            ? "bg-blue-50 text-blue-600"
                            : "text-slate-800 hover:bg-slate-50",
                        )}
                      >
                        <span className="text-lg font-bold">{item.title}</span>
                        <ChevronDown
                          className={cn(
                            "size-5 transition-transform duration-300",
                            openMobileMenus.includes(item.title) &&
                              "rotate-180",
                          )}
                        />
                      </button>

                      <div
                        className={cn(
                          "overflow-hidden transition-all duration-300",
                          openMobileMenus.includes(item.title)
                            ? "max-h-[2000px] opacity-100 mb-4"
                            : "max-h-0 opacity-0",
                        )}
                      >
                        <ul className="mt-1 space-y-1 px-2">
                          {item.items.map((subItem) => (
                            <li key={subItem.title}>
                              {subItem.items ? (
                                <div className="rounded-xl border border-blue-100/50 bg-slate-50/50 overflow-hidden my-1">
                                  <button
                                    onClick={() =>
                                      toggleMobileMenu(subItem.title)
                                    }
                                    className="flex items-center justify-between w-full p-4 text-left"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="p-2 bg-white rounded-lg shadow-sm">
                                        {subItem.icon}
                                      </div>
                                      <span className="text-sm font-bold text-slate-700">
                                        {subItem.title}
                                      </span>
                                    </div>
                                    <ChevronRight
                                      className={cn(
                                        "size-4 text-slate-400 transition-transform",
                                        openMobileMenus.includes(
                                          subItem.title,
                                        ) && "rotate-90",
                                      )}
                                    />
                                  </button>
                                  <div
                                    className={cn(
                                      "overflow-hidden transition-all duration-300 bg-white/60",
                                      openMobileMenus.includes(subItem.title)
                                        ? "max-h-[1000px] border-t border-blue-50"
                                        : "max-h-0",
                                    )}
                                  >
                                    <div className="grid grid-cols-1 gap-0.5 p-2">
                                      {subItem.items.map((deep) => (
                                        <Link
                                          key={deep.title}
                                          href={deep.url}
                                          onClick={() =>
                                            setIsMobileMenuOpen(false)
                                          }
                                          className="flex items-center gap-3 p-3 text-[12px] font-bold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                          <div className="size-1.5 rounded-full bg-blue-400" />
                                          {deep.title}
                                        </Link>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <Link
                                  href={subItem.url}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-blue-50 transition-all group"
                                >
                                  <div className="p-2 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                                    {subItem.icon}
                                  </div>
                                  <div>
                                    <div className="text-sm font-bold text-slate-800">
                                      {subItem.title}
                                    </div>
                                    {subItem.description && (
                                      <p className="text-[11px] text-slate-500 line-clamp-1">
                                        {subItem.description}
                                      </p>
                                    )}
                                  </div>
                                </Link>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={item.url}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block p-3.5 text-lg font-bold text-slate-800 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      {item.title}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 border-t bg-slate-50/80">
            {user ? (
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => {
                    router.push("/dashboard");
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 w-full p-3.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 shadow-sm"
                >
                  <LayoutDashboard className="size-5 text-blue-500" /> Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full p-3.5 bg-red-50 text-red-600 rounded-xl font-bold"
                >
                  <LogOut className="size-5" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  href={auth.login.url}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center p-3.5 border border-slate-200 bg-white rounded-xl font-bold text-slate-700 shadow-sm"
                >
                  Log in
                </Link>
                <Link
                  href={auth.signup.url}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center p-3.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export { Navbar };
