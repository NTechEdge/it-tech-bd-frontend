"use client";

import { useState } from "react";

const tabs = ["All", "InProgress", "Completed"];
const filters = ["Bengali", "English", "IT/Tech"];

const courses = [
  {
    id: 1,
    title: "ওয়েব ডেভেলপমেন্ট — শুরু থেকে শেষ",
    desc: "HTML, CSS, JavaScript দিয়ে সম্পূর্ণ ওয়েবসাইট তৈরি শিখুন। বাংলায় সহজ...",
    rating: 5,
    reviews: 324,
    badge: "শিক্ষার্থী",
    badgeColor: "bg-green-100 text-green-700",
    icon: "🌐",
    iconBg: "bg-blue-100",
    active: true,
  },
  {
    id: 2,
    title: "English for Career Development",
    desc: "চাকরির আবেদন, ইন্টারভিউ প্রস্তুতি এবং পেশাদার ইংরেজি যোগাযোগ শিখবেন।",
    rating: 4,
    reviews: 294,
    badge: "Intermediate",
    badgeColor: "bg-blue-100 text-blue-700",
    icon: "📚",
    iconBg: "bg-orange-100",
    active: false,
  },
  {
    id: 3,
    title: "Python প্রোগ্রামিং — বাংলায়",
    desc: "পাইথন দিয়ে প্রোগ্রামিং শুরু করুন। ডেটা বিজ্ঞান, ফাংশন, লুপ সব বাংলায়...",
    rating: 4,
    reviews: 172,
    badge: "শিক্ষার্থী",
    badgeColor: "bg-green-100 text-green-700",
    icon: "🐍",
    iconBg: "bg-green-100",
    active: false,
  },
  {
    id: 4,
    title: "ডিজিটাল মার্কেটিং মাস্টারক্লাস",
    desc: "Facebook Ads, SEO, Content Marketing — বাজার প্রজেক্টই সব শিখুন...",
    rating: 4,
    reviews: 168,
    badge: "দক্ষতা",
    badgeColor: "bg-purple-100 text-purple-700",
    icon: "📊",
    iconBg: "bg-pink-100",
    active: false,
  },
  {
    id: 5,
    title: "UI/UX ডিজাইন — Figma দিয়ে",
    desc: "Figma ব্যবহার করে প্রফেশনাল UI ডিজাইন করুন। সম্পূর্ণ বাংলা কোর্স।",
    rating: 5,
    reviews: 97,
    badge: "সব তব",
    badgeColor: "bg-yellow-100 text-yellow-700",
    icon: "🎨",
    iconBg: "bg-purple-100",
    active: false,
  },
  {
    id: 6,
    title: "Spoken English — ক্যারিয়ারের জন্য",
    desc: "চাকরির ইন্টারভিউ ও অফিসে ইংরেজি বলার দক্ষতা বাড়ান...",
    rating: 4,
    reviews: 211,
    badge: "সব তব",
    badgeColor: "bg-yellow-100 text-yellow-700",
    icon: "🗣️",
    iconBg: "bg-blue-100",
    active: false,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="12" height="12" viewBox="0 0 24 24" fill={s <= rating ? "#F59E0B" : "#D1D5DB"}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}

export default function CourseListPanel() {
  const [activeTab, setActiveTab] = useState("All");
  const [activeFilter, setActiveFilter] = useState("Bengali");
  const [selectedId, setSelectedId] = useState(1);

  return (
    <div className="w-105 shrink-0 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-gray-900">Courses</h1>
          <button className="text-gray-500 hover:text-gray-700">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200 mb-3">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "text-gray-900 border-b-2 border-gray-900"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeFilter === f
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Course list */}
      <div className="flex-1 overflow-y-auto">
        {courses.map((course) => (
          <button
            key={course.id}
            onClick={() => setSelectedId(course.id)}
            className={`w-full text-left px-4 py-3 border-b border-gray-100 transition-colors ${
              selectedId === course.id ? "bg-orange-50 border-l-4 border-l-[#E8630A]" : "hover:bg-gray-50"
            }`}
          >
            <div className="flex gap-3">
              <div className={`w-10 h-10 rounded-lg ${course.iconBg} flex items-center justify-center text-lg shrink-0`}>
                {course.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 leading-snug mb-1 line-clamp-2">
                  {course.title}
                </p>
                <p className="text-xs text-gray-500 line-clamp-2 mb-1">{course.desc}</p>
                <div className="flex items-center gap-2">
                  <StarRating rating={course.rating} />
                  <span className="text-xs text-gray-500">{course.rating} ({course.reviews})</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${course.badgeColor}`}>
                    {course.badge}
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
