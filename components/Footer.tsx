"use client";

import Link from "next/link";
import { FiFacebook } from "react-icons/fi";
import { FaInstagram } from "react-icons/fa";
import { LuPhoneCall } from "react-icons/lu";
import { MdOutlineMail } from "react-icons/md";

export const Footer = () => {
  return (
    <footer className="bg-blue-100 text-white">
      <div className="container py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* FLEX CONTAINER */}
        <div className="flex flex-col items-center gap-10 md:flex-row md:items-start md:justify-between px-10">
          {/* Brand */}
          <div className="flex flex-col gap-4 items-center text-center md:items-start md:text-left max-w-xs">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="logo"
                className="h-9 w-auto object-contain"
              />
            </Link>

            <p className="text-sm text-gray-900 leading-relaxed">
              Providing professional USCIS support, tax preparation, and
              administrative services to help you navigate your journey with
              confidence.
            </p>

            <div className="flex items-center gap-4 mt-2">
              <Link
                target="_blank"
                href="https://www.instagram.com/kingson_ksa?igsh=MWRocjUwdzBqeDA2dw%3D%3D&utm_source=qr"
                className="text-gray-900 hover:text-blue-500 transition-colors"
              >
                <FaInstagram className="size-5" />
              </Link>
              <Link
                target="_blank"
                href="https://www.facebook.com/share/1B2bGGQBpW/?mibextid=wwXIfr"
                className="text-gray-900 hover:text-blue-500 transition-colors"
              >
                <FiFacebook className="size-5" />
              </Link>
            </div>
          </div>

          {/* Company */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left text-gray-900">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Company
            </h3>

            <ul className="flex flex-col gap-3 text-sm text-gray-900">
              <li>
                <Link
                  href="/about"
                  className="hover:text-blue-500 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-blue-500 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left text-gray-900">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Support
            </h3>

            <ul className="flex flex-col items-center md:items-start gap-4 text-sm">
              <li className="hover:text-blue-500 transition-colors">
                <span className="flex items-center gap-2">
                  <LuPhoneCall className="size-5" />
                  <span>+1(407)325-4909</span>
                </span>
              </li>

              <li className="hover:text-blue-500 transition-colors break-all">
                <span className="flex items-center gap-2">
                  <MdOutlineMail className="size-5" />
                  <span>Ksglobalservicesllc1@gmail.com</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-white pt-6">
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
            <p className="text-xs text-center text-gray-900">
              © {new Date().getFullYear()} KS Services LLC. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
