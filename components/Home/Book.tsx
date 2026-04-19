"use client";

import React from "react";
import { ShoppingCart, ArrowRight, Star } from "lucide-react";

export default function BookFeature() {
  return (
    <section className="relative bg-white py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Visual Side: Minimalist & Tactile */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative group cursor-pointer">
              {/* Subtle Shadow Layer */}
              <div className="absolute inset-0 bg-black/5 blur-3xl rounded-full scale-75 translate-y-12" />

              {/* Book Cover */}
              <div className="relative w-64 md:w-80 lg:w-[380px] aspect-[3/4] transition-transform duration-500 ease-out group-hover:scale-[1.01]">
                <div className="w-full h-fit bg-gray-100 rounded-r-lg rounded-l-sm overflow-hidden shadow-[10px_20px_50px_-15px_rgba(0,0,0,0.2)] border-l border-black/5">
                  <img
                    src="/book-cover.jpg"
                    alt="Book Cover"
                    className="w-full h-full object-contain"
                  />
                  {/* Spine Highlight for Realism */}
                  <div className="absolute inset-y-0 left-0 w-[4px] bg-gradient-to-r from-black/20 to-transparent" />
                </div>
              </div>

              {/* Trust Badge */}
              <div className="absolute -bottom-4 -right-4 bg-white border border-gray-100 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-[11px] font-bold text-gray-900 uppercase tracking-widest">
                  Top Rated
                </span>
              </div>
            </div>
          </div>

          {/* Content Side: High-End Typography */}
          <div className="w-full lg:w-1/2">
            <div className="max-w-lg">
              <h4 className="text-blue-600 font-bold text-xs uppercase tracking-[0.3em] mb-6">
                Now Available on Amazon
              </h4>

              <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight tracking-tight mb-6">
                Sonje w se imigran
              </h2>

              <p className="text-gray-600 text-lg leading-relaxed mb-10">
                Sonje’w Se Imigran se yon liv ki fèt pou bay fòs, kouraj, ak
                direksyon tout imigran k ap chèche bati lavi yo Ozetazini.
                Atravè eksperyans pèsonèl otè a, w ap jwenn konsèy sou travay,
                biznis, relasyon, ak devlopman pèsonèl. Liv sa a se yon gid pou
                w kenbe lafwa, pran bon desizyon, epi aprann kijan pou w reyisi
                san w pa pèdi idantite w kòm imigran.
              </p>

              {/* CTA Section */}
              <div className="flex flex-col sm:flex-row items-center gap-5">
                <a
                  href="https://a.co/d/034sAwXg"
                  target="_blank"
                  className="w-full sm:w-auto px-10 py-5 bg-blue-800 text-white rounded-full font-bold text-sm flex items-center justify-center gap-3 transition-all hover:bg-blue-900 hover:shadow-md hover:shadow-blue-600/20 active:scale-95"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Purchase on Amazon
                </a>
              </div>

              {/* Format Availability */}
              <div className="mt-12 pt-8 border-t border-gray-300 flex gap-8">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter mb-1">
                    Format
                  </p>
                  <p className="text-sm font-semibold text-gray-800">
                    Hardcover, Digital
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter mb-1">
                    Shipping
                  </p>
                  <p className="text-sm font-semibold text-gray-800">
                    Worldwide Delivery
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
