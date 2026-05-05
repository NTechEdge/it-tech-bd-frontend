import { Metadata } from 'next';
import PublicLayout from "@/components/layout/PublicLayout";

// Force static generation
export const dynamic = 'force-static';

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'About IT TECH BD | Our Mission & Values',
    description: 'Learn about IT TECH BD\'s mission to empower learners in Bangladesh with cutting-edge IT education and practical skills.',
    keywords: 'IT TECH BD, about, mission, values, IT education Bangladesh',
    openGraph: {
      title: 'About IT TECH BD',
      description: 'Empowering learners in Bangladesh and beyond with cutting-edge IT education.',
      type: 'website',
    },
    alternates: {
      canonical: '/about',
    },
  };
}

export default function AboutPage() {
  return (
    <PublicLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
      <section className="bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">About IT-TECH-BD</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Empowering learners in Bangladesh and beyond with cutting-edge IT education and practical skills.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-10 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Our Mission</h2>
            <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
              At IT TECH BD, we believe that quality education should be accessible to everyone. Our mission is to bridge the gap between traditional education and industry demands by providing practical, hands-on training in the latest technologies.
            </p>
            <p className="text-base sm:text-lg text-gray-600">
              We work with industry experts to create courses that are not just informative but directly applicable to real-world scenarios. Whether you&apos;re a beginner starting your journey or a professional looking to upskill, we have the right course for you.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-10 sm:py-16 lg:py-20 bg-linear-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Our Values</h2>
            <p className="text-base sm:text-xl text-gray-600">The principles that guide everything we do</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-linear-to-br from-[#003399] via-[#0099ff] to-[#00d4ff] rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg width="24" height="24" className="sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Quality</h3>
              <p className="text-sm text-gray-600">We maintain the highest standards in course content and instruction.</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg width="24" height="24" className="sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Innovation</h3>
              <p className="text-sm text-gray-600">We constantly update our curriculum to match industry trends.</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-linear-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg width="24" height="24" className="sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Community</h3>
              <p className="text-sm text-gray-600">We foster a supportive learning environment for all students.</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-linear-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg width="24" height="24" className="sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Creativity</h3>
              <p className="text-sm text-gray-600">We encourage creative problem-solving and thinking outside the box.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-10 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Our Story</h2>
              <p className="text-base sm:text-lg text-gray-600 mb-3 sm:mb-4">
                IT TECH BD was founded with a simple goal: to make quality IT education accessible to everyone in Bangladesh. We noticed a gap between what was being taught in traditional institutions and what the industry actually needed.
              </p>
              <p className="text-base sm:text-lg text-gray-600 mb-3 sm:mb-4">
                Starting with just a handful of courses, we've grown into a comprehensive platform offering training in web development, mobile development, data science, cloud computing, and more.
              </p>
              <p className="text-base sm:text-lg text-gray-600">
                Today, we're proud to have helped thousands of students launch successful careers in the tech industry. But we're just getting started – we have big plans for the future!
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square bg-linear-to-br from-[#003399] via-[#0099ff] to-[#00d4ff] rounded-2xl flex items-center justify-center">
                <svg width="120" height="120" className="sm:w-[200px] sm:h-[200px]" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 sm:py-16 lg:py-20 bg-linear-to-r from-[#003399] via-[#0099ff] to-[#00d4ff]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Join Our Learning Community</h2>
          <p className="text-base sm:text-xl text-blue-100 mb-6 sm:mb-8">
            Start your journey today and become part of our growing community of learners.
          </p>
          <a
            href="/courses"
            className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-white text-[#003399] font-semibold rounded-xl hover:bg-gray-100 transition-all shadow-lg text-base sm:text-lg"
          >
            Explore Courses
          </a>
        </div>
      </section>
    </div>
    </PublicLayout>
  );
}
