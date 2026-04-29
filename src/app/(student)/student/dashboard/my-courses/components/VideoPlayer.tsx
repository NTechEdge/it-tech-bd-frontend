"use client";

import { useRef, useCallback, useEffect } from "react";
import { useEnrollment } from "@/hooks/useEnrollment";
import LockedVideoPlaceholder from "@/components/course/LockedVideoPlaceholder";

export interface VideoPlayerProps {
  videoId: string;
  startTime?: number;
  title: string;
  courseId: string;
  onTimeUpdate?: (currentTime: number) => void;
  onEnrollClick?: () => void;
}

export default function VideoPlayer({
  videoId,
  startTime = 0,
  title,
  courseId,
  onTimeUpdate,
  onEnrollClick,
}: VideoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { hasAccess, isAuthenticated } = useEnrollment();

  const canAccess = hasAccess(courseId);

  const getYouTubeUrl = useCallback((time: number) => {
    return `https://www.youtube.com/embed/${videoId}?start=${time}&autoplay=1&rel=0&modestbranding=1&controls=1&disablekb=0&fs=1`;
  }, [videoId]);

  useEffect(() => {
    if (!canAccess) return;

    // Prevent right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Prevent common keyboard shortcuts for opening inspector
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) ||
        (e.ctrlKey && e.key === "U")
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // Prevent drag to prevent some inspection methods
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // Prevent text selection
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // Detect dev tools (basic detection)
    const detectDevTools = () => {
      const threshold = 160;
      if (window.outerWidth - window.innerWidth > threshold ||
          window.outerHeight - window.innerHeight > threshold) {
        console.clear();
        console.log("%cDev Tools detected! Please close for security reasons.", "color: red; font-size: 20px;");
      }
    };

    const element = containerRef.current;
    if (element) {
      element.addEventListener("contextmenu", handleContextMenu);
      element.addEventListener("keydown", handleKeyDown);
      element.addEventListener("dragstart", handleDragStart);
      element.addEventListener("selectstart", handleSelectStart);

      // Add iframe-specific protection
      const iframe = iframeRef.current;
      if (iframe) {
        iframe.addEventListener("contextmenu", handleContextMenu);
        iframe.addEventListener("selectstart", handleSelectStart);
      }

      // Periodic dev tools check
      const intervalId = setInterval(detectDevTools, 1000);

      return () => {
        element.removeEventListener("contextmenu", handleContextMenu);
        element.removeEventListener("keydown", handleKeyDown);
        element.removeEventListener("dragstart", handleDragStart);
        element.removeEventListener("selectstart", handleSelectStart);
        if (iframe) {
          iframe.removeEventListener("contextmenu", handleContextMenu);
          iframe.removeEventListener("selectstart", handleSelectStart);
        }
        clearInterval(intervalId);
      };
    }
  }, [canAccess]);

  if (!canAccess) {
    return (
      <LockedVideoPlaceholder
        courseTitle={title}
        onEnrollClick={onEnrollClick || (() => {})}
        isAuthenticated={isAuthenticated}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative bg-black aspect-video w-full rounded-lg overflow-hidden shadow-xl"
      tabIndex={0}
    >
      <style jsx global>{`
        .ytSpecTouchFeedbackShapeHost,
        .ytSpecTouchFeedbackShapeTouchResponse {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }
      `}</style>
      <iframe
        ref={iframeRef}
        className="absolute inset-0 w-full h-full pointer-events-auto"
        src={getYouTubeUrl(startTime)}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}
