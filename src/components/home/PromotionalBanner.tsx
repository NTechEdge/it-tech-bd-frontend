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
        className="block relative overflow-hidden rounded-2xl shadow-lg mx-0 sm:mx-0"
        style={{
          backgroundColor: currentBanner.bgColor || '#f97316',
          aspectRatio: '16 / 7',
          minHeight: '200px'
        }}
      >
        {/* Background Image with Overlay */}
        {currentBanner.imageUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
            style={{ backgroundImage: `url(${currentBanner.imageUrl})` }}
          >
            <div className="absolute inset-0 bg-linear-to-r from-black/70 to-black/40"></div>
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 h-full flex items-center px-6 sm:px-8 md:px-12 py-8">
          <div className="max-w-2xl">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3">
              {currentBanner.title}
            </h2>
            <p className="text-sm sm:text-base text-gray-200 mb-3 sm:mb-4 line-clamp-2">
              {currentBanner.description}
            </p>
            {currentBanner.link && (
              <span className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-colors text-sm">
                Learn More
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            )}
          </div>
        </div>

        {/* Gradient Overlay at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-black/50 to-transparent"></div>
      </BannerWrapper>
    </div>
  );
}
