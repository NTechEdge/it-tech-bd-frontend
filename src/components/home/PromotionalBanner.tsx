'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Banner {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link?: string;
  bgColor?: string;
}

interface PromotionalBannerProps {
  banners: Banner[];
}

export default function PromotionalBanner({ banners }: PromotionalBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [banners.length]);

  if (banners.length === 0) return null;

  const currentBanner = banners[currentIndex];
  const BannerWrapper = currentBanner.link ? Link : 'div';

  return (
    <div className="w-full">
      <BannerWrapper
        href={currentBanner.link || '#'}
        className="block relative overflow-hidden rounded-xl sm:rounded-2xl xl:rounded-3xl shadow-lg"
        style={{
          backgroundColor: currentBanner.bgColor || '#f97316',
        }}
      >
        {/* Background Image with Overlay */}
        {currentBanner.imageUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
            style={{ backgroundImage: `url(${currentBanner.imageUrl})` }}
          >
            <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/60 to-black/40 sm:from-black/70 sm:to-black/40"></div>
          </div>
        )}

        {/* Content - Responsive positioning */}
        <div className="relative z-10 min-h-50 sm:min-h-60 md:min-h-70 lg:min-h-80 xl:min-h-100 flex items-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-6 sm:py-8 lg:py-10">
          <div className="w-full max-w-xl sm:max-w-2xl lg:max-w-3xl">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-1.5 sm:mb-2 md:mb-3 lg:mb-4 leading-tight">
              {currentBanner.title}
            </h2>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-100 mb-3 sm:mb-4 lg:mb-5 line-clamp-2 sm:line-clamp-none max-w-2xl">
              {currentBanner.description}
            </p>
            {currentBanner.link && (
              <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 lg:px-6 py-1.5 sm:py-2 lg:py-2.5 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors text-xs sm:text-sm md:text-base">
                Learn More
                <svg width="12" height="12" className="sm:w-3.5 sm:h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            )}
          </div>
        </div>

        {/* Gradient Overlay at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-12 sm:h-16 lg:h-20 bg-linear-to-t from-black/60 to-transparent"></div>
      </BannerWrapper>
    </div>
  );
}
