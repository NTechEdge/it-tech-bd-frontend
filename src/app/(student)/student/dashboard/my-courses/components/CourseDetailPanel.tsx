"use client";

import { useState } from "react";

const lessons = [
  { id: 1, title: " Intro", duration: "5.5 min", active: true },
  { id: 2, title: "HTML basics", duration: "12 min", active: false },
  { id: 3, title: "CSS fundamentals", duration: "18 min", active: false },
  { id: 4, title: "JavaScript introduction", duration: "20 min", active: false },
  { id: 5, title: "Building a simple webpage", duration: "25 min", active: false },
  { id: 6, title: "Responsive design", duration: "15 min", active: false },
  { id: 7, title: "CSS Flexbox & Grid", duration: "22 min", active: false },
  { id: 8, title: "JavaScript DOM manipulation", duration: "30 min", active: false },
  { id: 9, title: "Adding interactivity with JS", duration: "28 min", active: false },
  { id: 10, title: "Project setup and deployment", duration: "35 min", active: false },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill={s <= rating ? "#F59E0B" : "#D1D5DB"}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}

export default function CourseDetailPanel() {
  const [playing, setPlaying] = useState(false);
  const [progress] = useState(35);

  return (
    <div className="flex-1 flex p-2 flex-col h-full overflow-y-auto bg-gray-50">
      {/* Video player */}
      <div className="relative bg-[#1a0a00] aspect-video w-full">
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={() => setPlaying(!playing)}
            className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors backdrop-blur-sm"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? (
              <svg width="28" height="28" fill="white" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg width="28" height="28" fill="white" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 px-3 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-white/70 text-xs">00:00</span>
            <div className="flex-1 h-1 bg-white/30 rounded-full">
              <div
                className="h-full bg-[#0099ff] rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-white/70 text-xs">4h 20m</span>
          </div>
        </div>
      </div>

      {/* Course info */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <StarRating rating={5} />
          <span className="text-sm text-gray-600">5 (324)</span>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
            Student
          </span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Web Development — From Scratch to Finish
        </h2>
        <p className="text-gray-600 text-sm">
          Learn to build complete websites with HTML, CSS, and JavaScript. Explained in simple language.
        </p>
      </div>

      {/* Instructor + enroll */}
      <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#0099ff] flex items-center justify-center text-white font-bold text-sm">
            র
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">Rahela Begum</p>
            <p className="text-xs text-gray-500">Senior Web Developer</p>
          </div>
        </div>
        <button className="bg-[#0099ff] hover:bg-[#d05a09] text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors">
          Enroll — Tk 1200
        </button>
      </div>

      {/* Curriculum */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-900">Course Content</h3>
          <span className="text-xs text-gray-500">18 lessons • 4h 20m</span>
        </div>
        <div className="space-y-2">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                lesson.active
                  ? "bg-blue-50 border-blue-200"
                  : "bg-white border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                lesson.active ? "bg-[#0099ff]" : "bg-gray-100"
              }`}>
                <svg width="14" height="14" fill={lesson.active ? "white" : "#9CA3AF"} viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${lesson.active ? "text-[#0099ff]" : "text-gray-800"}`}>
                  {lesson.title}
                </p>
                <p className="text-xs text-gray-500">{lesson.duration}</p>
              </div>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="text-gray-400">
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
