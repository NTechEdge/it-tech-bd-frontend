'use client';

import { useState, useEffect } from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import PromotionalBanner from '@/components/home/PromotionalBanner';
import BannerIndicators from '@/components/home/BannerIndicators';
import TrendingCoursesSlider from '@/components/home/TrendingCoursesSlider';
import AllCoursesSection from '@/components/home/AllCoursesSection';
import { Course } from '@/lib/api/server';

// Mock banners data
const mockBanners = [
  {
    id: '1',
    title: 'Learn Web Development',
    description: 'Master modern web technologies with our comprehensive courses',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=400&fit=crop',
    link: '/courses',
    bgColor: '#f97316'
  },
  {
    id: '2',
    title: 'Mobile App Development',
    description: 'Build beautiful mobile apps with React Native and Flutter',
    imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&h=400&fit=crop',
    link: '/courses',
    bgColor: '#3b82f6'
  },
  {
    id: '3',
    title: 'Data Science & AI',
    description: 'Explore machine learning, data analysis, and artificial intelligence',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=400&fit=crop',
    link: '/courses',
    bgColor: '#8b5cf6'
  }
];

interface HomePageClientProps {
  courses: Course[];
}

export default function HomePageClient({ courses }: HomePageClientProps) {
  const [mounted, setMounted] = useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0099ff]-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Generate trending and all courses with mock data on client side
  const trendingCourses = courses.slice(0, 6).map(course => ({
    ...course,
    rating: 4.5 + Math.random() * 0.5,
    studentsCount: Math.floor(Math.random() * 5000) + 500
  }));

  const allCourses = courses.map(course => ({
    ...course,
    rating: 4.0 + Math.random() * 1.0,
    category: ['Development', 'Design', 'Business', 'Marketing'][Math.floor(Math.random() * 4)]
  }));

  return (
    <PublicLayout>
      {/* Main Content - matches Flutter home screen */}
      <div className="space-y-4 sm:space-y-6">
        {/* Promotional Banners */}
        <div>
          <PromotionalBanner banners={mockBanners} />
          <BannerIndicators
            totalCount={mockBanners.length}
            currentIndex={currentBannerIndex}
            onIndicatorClick={setCurrentBannerIndex}
          />
        </div>

        {/* Trending Courses Slider */}
        <TrendingCoursesSlider courses={trendingCourses} />

        {/* All Courses Section */}
        <AllCoursesSection courses={allCourses} />
      </div>
    </PublicLayout>
  );
}
