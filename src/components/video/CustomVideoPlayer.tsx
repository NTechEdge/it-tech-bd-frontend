"use client";

import { useRef, useState, useEffect, useCallback } from "react";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export interface CustomVideoPlayerProps {
  videoId: string;
  startTime?: number;
  title?: string;
  onTimeUpdate?: (currentTime: number) => void;
  onStateChange?: (state: 'playing' | 'paused' | 'ended') => void;
}

export default function CustomVideoPlayer({
  videoId,
  startTime = 0,
  title = "Video",
  onTimeUpdate,
  onStateChange,
}: CustomVideoPlayerProps) {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeContainerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const qualityMenuRef = useRef<HTMLDivElement>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastInteractionRef = useRef<number>(0);

  useEffect(() => {
    lastInteractionRef.current = Date.now();
  }, []);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(startTime);
  const [duration, setDuration] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isAPILoaded, setIsAPILoaded] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [availableQualities, setAvailableQualities] = useState<string[]>([]);
  const [currentQuality, setCurrentQuality] = useState<string>('auto');
  const [isChangingQuality, setIsChangingQuality] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Track fullscreen changes
  useEffect(() => {
    const onFSChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFSChange);
    return () => document.removeEventListener('fullscreenchange', onFSChange);
  }, []);

  // Auto-hide controls timer
  const resetHideTimer = useCallback(() => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    lastInteractionRef.current = Date.now();
    setShowControls(true);

    if (isPlaying && !showQualityMenu) {
      hideTimeoutRef.current = setTimeout(() => {
        if (Date.now() - lastInteractionRef.current >= 2500) {
          setShowControls(false);
        }
      }, 3000);
    }
  }, [isPlaying, showQualityMenu]);

  useEffect(() => {
    if (!isPlaying || showQualityMenu) {
      setShowControls(true);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    }
  }, [isPlaying, showQualityMenu]);

  const handleMouseMove = useCallback(() => {
    lastInteractionRef.current = Date.now();
    setShowControls(true);
    resetHideTimer();
  }, [resetHideTimer]);

  const handleMouseLeave = useCallback(() => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    if (isPlaying) setShowControls(false);
  }, [isPlaying]);

  const handleMouseEnter = useCallback(() => {
    lastInteractionRef.current = Date.now();
    setShowControls(true);
  }, []);

  // Mobile tap to toggle controls
  const handleTap = useCallback(() => {
    lastInteractionRef.current = Date.now();
    setShowControls(prev => {
      if (!prev) {
        // Show and schedule hide
        if (isPlaying && !showQualityMenu) {
          if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
          hideTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
        }
        return true;
      }
      return prev;
    });
  }, [isPlaying, showQualityMenu]);

  // Close quality menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (qualityMenuRef.current && !qualityMenuRef.current.contains(event.target as Node)) {
        setShowQualityMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Update time tracking
  const updateTime = useCallback(() => {
    if (playerRef.current && isReady && isPlaying && typeof playerRef.current.getCurrentTime === 'function') {
      const time = playerRef.current.getCurrentTime();
      setCurrentTime(time);
      onTimeUpdate?.(time);
    }
  }, [isReady, isPlaying, onTimeUpdate]);

  // Load YouTube IFrame API
  useEffect(() => {
    if (typeof window !== "undefined" && window.YT) {
      setIsAPILoaded(true);
      return;
    }
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    if (firstScriptTag && firstScriptTag.parentNode) {
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
    window.onYouTubeIframeAPIReady = () => setIsAPILoaded(true);
    return () => { window.onYouTubeIframeAPIReady = () => { }; };
  }, []);

  const refreshQualities = useCallback(() => {
    if (!playerRef.current || !isReady) return;
    setTimeout(() => {
      if (playerRef.current && typeof playerRef.current.getAvailableQualityLevels === 'function') {
        const qualities = playerRef.current.getAvailableQualityLevels();
        if (qualities && qualities.length > 0) setAvailableQualities(qualities.reverse());
      }
    }, 500);
  }, [isReady]);


  // Initialize player
  useEffect(() => {
    if (!isAPILoaded || !iframeContainerRef.current) return;

    if (playerRef.current) {
      const currentVideoId = playerRef.current.getVideoData?.()?.video_id;
      if (currentVideoId === videoId) return;
      if (typeof playerRef.current.destroy === "function") {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    }

    setIsReady(false);
    setAvailableQualities([]);

    const player = new window.YT.Player(iframeContainerRef.current, {
      videoId,
      start: startTime,
      playerVars: {
        autoplay: 1,
        controls: 0,
        disablekb: 1,
        fs: 0,
        rel: 0,
        modestbranding: 1,
        playsinline: 1,
        widget_referrer: window.location.href,
      },
      events: {
        onReady: (event: { target: any }) => {
          setIsReady(true);
          playerRef.current = event.target;
          const initialDuration = event.target.getDuration();
          if (initialDuration && initialDuration > 0) setDuration(initialDuration);
          setCurrentTime(startTime);

          let attempts = 0;
          const durationInterval = setInterval(() => {
            if (playerRef.current && typeof playerRef.current.getDuration === 'function') {
              const dur = playerRef.current.getDuration();
              if (dur && dur > 0) { setDuration(dur); clearInterval(durationInterval); }
            }
            if (++attempts > 10) clearInterval(durationInterval);
          }, 500);

          setTimeout(() => {
            if (event.target && typeof event.target.getAvailableQualityLevels === 'function') {
              const qualities = event.target.getAvailableQualityLevels();
              if (qualities && qualities.length > 0) {
                setAvailableQualities(qualities.reverse());
                if (typeof event.target.getPlaybackQuality === 'function') {
                  setCurrentQuality(event.target.getPlaybackQuality());
                }
              }
            }
          }, 1500);
        },
        onStateChange: (event: { data: number; target?: any }) => {
          if (event.data === window.YT.PlayerState.PLAYING) {
            setIsPlaying(true);
            onStateChange?.('playing');
            if (event.target && typeof event.target.getDuration === 'function') {
              const vidDuration = event.target.getDuration();
              if (vidDuration && vidDuration > 0) setDuration(vidDuration);
            }
            refreshQualities();
          } else if (event.data === window.YT.PlayerState.PAUSED) {
            setIsPlaying(false);
            onStateChange?.('paused');
          } else if (event.data === window.YT.PlayerState.ENDED) {
            setIsPlaying(false);
            onStateChange?.('ended');
          } else if (event.data === window.YT.PlayerState.BUFFERING) {
            if (!isChangingQuality) refreshQualities();
          }
        },
        onPlaybackQualityChange: (event: { data: string }) => {
          setCurrentQuality(event.data);
          setIsChangingQuality(false);
        },
      },
    });

    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      if (player && typeof player.destroy === "function") player.destroy();
    };
  }, [isAPILoaded, videoId]);

  // Time update interval
  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying && playerRef.current) updateTime();
    }, 250);
    return () => clearInterval(interval);
  }, [isPlaying, updateTime]);


  // Security: Prevent right-click, keyboard shortcuts, and inspection
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => { e.preventDefault(); return false; };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) ||
        (e.ctrlKey && e.key === "U")
      ) { e.preventDefault(); e.stopPropagation(); return false; }
    };
    const handleDragStart = (e: DragEvent) => { e.preventDefault(); return false; };
    const handleSelectStart = (e: Event) => { e.preventDefault(); return false; };
    const handleCopy = (e: Event) => { e.preventDefault(); return false; };

    const element = containerRef.current;
    if (element) {
      element.addEventListener("contextmenu", handleContextMenu);
      element.addEventListener("keydown", handleKeyDown);
      element.addEventListener("dragstart", handleDragStart);
      element.addEventListener("selectstart", handleSelectStart);
      element.addEventListener("copy", handleCopy);
    }
    return () => {
      if (element) {
        element.removeEventListener("contextmenu", handleContextMenu);
        element.removeEventListener("keydown", handleKeyDown);
        element.removeEventListener("dragstart", handleDragStart);
        element.removeEventListener("selectstart", handleSelectStart);
        element.removeEventListener("copy", handleCopy);
      }
    };
  }, []);

  // Control functions
  const togglePlayPause = useCallback(() => {
    if (!playerRef.current || !isReady || typeof playerRef.current.playVideo !== 'function') return;
    if (isPlaying) {
      playerRef.current.pauseVideo?.();
    } else {
      playerRef.current.playVideo?.();
    }
    resetHideTimer();
  }, [isPlaying, isReady, resetHideTimer]);

  const handleForward = useCallback(() => {
    if (!playerRef.current || !isReady || typeof playerRef.current.seekTo !== 'function') return;
    const newTime = Math.min(currentTime + 10, duration);
    playerRef.current.seekTo(newTime, true);
    setCurrentTime(newTime);
    resetHideTimer();
  }, [currentTime, duration, isReady, resetHideTimer]);

  const handleBackward = useCallback(() => {
    if (!playerRef.current || !isReady || typeof playerRef.current.seekTo !== 'function') return;
    const newTime = Math.max(currentTime - 10, 0);
    playerRef.current.seekTo(newTime, true);
    setCurrentTime(newTime);
    resetHideTimer();
  }, [currentTime, isReady, resetHideTimer]);

  // Fullscreen with auto-rotate to landscape on mobile
  const handleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;

    if (document.fullscreenElement) {
      await document.exitFullscreen();
      // Unlock orientation when exiting fullscreen
      if (screen.orientation && typeof (screen.orientation as any).unlock === 'function') {
        try { (screen.orientation as any).unlock(); } catch (_) { }
      }
    } else {
      await containerRef.current.requestFullscreen();
      // Lock to landscape on mobile after entering fullscreen
      if (isMobile && screen.orientation && typeof (screen.orientation as any).lock === 'function') {
        try { await (screen.orientation as any).lock('landscape'); } catch (_) { }
      }
    }
    resetHideTimer();
  }, [isMobile, resetHideTimer]);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!playerRef.current || !isReady || typeof playerRef.current.seekTo !== 'function') return;
    const time = parseFloat(e.target.value);
    playerRef.current.seekTo(time, true);
    setCurrentTime(time);
  }, [isReady]);

  const handleQualityChange = useCallback(async (quality: string) => {
    if (!playerRef.current || !isReady) return;
    setIsChangingQuality(true);
    setShowQualityMenu(false);

    const wasPlaying = isPlaying;
    const currentTimePos = playerRef.current.getCurrentTime();

    if (wasPlaying) playerRef.current.pauseVideo();
    await new Promise(resolve => setTimeout(resolve, 200));
    if (typeof playerRef.current.setPlaybackQuality === 'function') {
      playerRef.current.setPlaybackQuality(quality);
    }
    playerRef.current.seekTo(currentTimePos, true);
    await new Promise(resolve => setTimeout(resolve, 800));
    if (wasPlaying) playerRef.current.playVideo();
    setCurrentQuality(quality);
    setTimeout(() => { setIsChangingQuality(false); refreshQualities(); }, 1500);
    resetHideTimer();
  }, [isReady, isPlaying, refreshQualities, resetHideTimer]);

  const formatQualityLabel = (quality: string) => {
    const qualityMap: Record<string, string> = {
      'auto': 'Auto', 'highres': '4K', 'hd2160': '4K', 'hd1440': '1440p',
      'hd1080': '1080p', 'hd720': '720p', 'large': '480p',
      'medium': '360p', 'small': '240p', 'tiny': '144p',
    };
    return qualityMap[quality] || quality;
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hours > 0) return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };


  return (
    <div
      ref={containerRef}
      className="relative bg-black aspect-video w-full rounded-lg overflow-hidden shadow-xl select-none"
      tabIndex={0}
      data-video-player="true"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      {/* YouTube Iframe Container */}
      <div
        key={`yt-player-${videoId}`}
        ref={iframeContainerRef}
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: 'none' }}
      />

      {/* Security + Responsive CSS */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .ytp-chrome-controls, .ytp-chrome-bottom, .ytp-gradient-bottom,
        .ytp-progress-bar-container, .ytp-progress-bar, .ytp-pause-overlay,
        .ytp-title, .ytp-title-text, .ytp-title-channel, .html5-video-player,
        .ytp-big-play-button, .ytp-doubletap-ui, .ytp-touch-feedback,
        .iv-branding, .video-ads, .ytp-ad-player-overlay,
        .ytp-ad-overlay-container, .ytp-ad-module, .ytp-ad-progress-list,
        .ytp-ad-progress, .ytp-paid-content-overlay, .ytp-show-ad-titles,
        .ytp-watermark, .ytp-watermark yt-icon-shape, .ytp-watermark .yt-uix-tooltip,
        .ytp-share-button, .ytp-share-icon, .ytp-subtitles-button,
        .ytp-settings-button, .ytp-contextmenu {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }
        [data-video-player] {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
          -webkit-touch-callout: none !important;
        }
        @media (max-width: 767px) {
          .mobile-seek::-webkit-slider-thumb {
            width: 18px !important;
            height: 18px !important;
          }
          .mobile-seek::-moz-range-thumb {
            width: 18px !important;
            height: 18px !important;
          }
        }
      ` }} />

      {/* Transparent Overlay */}
      <div
        className="absolute inset-0 z-10 bg-transparent"
        onDoubleClick={!isMobile ? handleFullscreen : undefined}
        onClick={() => {
          if (isMobile) {
            handleTap();
          } else if (isReady && !isChangingQuality) {
            togglePlayPause();
          }
        }}
      />

      {/* Loading State */}
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-20">
          <div className="w-12 h-12 border-4 border-[#0099ff] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Quality changing indicator */}
      {isChangingQuality && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 bg-black/80 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Changing quality...
        </div>
      )}

      {/* ── DESKTOP CONTROLS ── */}
      {!isMobile && (
        <div
          ref={controlsRef}
          className={`absolute bottom-0 left-0 right-0 z-30 bg-linear-to-t from-black via-black/80 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
        >
          {/* Progress Bar */}
          <div className="px-4 pt-6">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                [&::-webkit-slider-thumb]:bg-[#0099ff] [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:hover:scale-125
                [&::-webkit-slider-thumb]:transition-transform
                [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5
                [&::-moz-range-thumb]:bg-[#0099ff] [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none"
            />
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between px-4 pb-4 pt-2">
            <div className="flex items-center gap-3">
              {/* Play/Pause */}
              <button
                onClick={togglePlayPause}
                disabled={!isReady || isChangingQuality}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white hover:bg-gray-100 text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" /></svg>
                ) : (
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                )}
              </button>

              {/* Backward 10s */}
              <button
                onClick={handleBackward}
                disabled={!isReady || isChangingQuality}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/90 hover:bg-white text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                aria-label="Backward 10 seconds"
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                </svg>
              </button>

              {/* Forward 10s */}
              <button
                onClick={handleForward}
                disabled={!isReady || isChangingQuality}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/90 hover:bg-white text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                aria-label="Forward 10 seconds"
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
                </svg>
              </button>

              {/* Time Display */}
              <div className="flex items-center gap-2 text-white text-sm font-bold bg-black/80 px-3 py-1.5 rounded shadow-md min-w-24">
                <span>{formatTime(currentTime)}</span>
                <span className="text-white/50">/</span>
                <span className="text-white/90">{duration > 0 ? formatTime(duration) : '--:--'}</span>
              </div>
            </div>

            {/* Right side controls */}
            <div className="flex items-center gap-2" ref={qualityMenuRef}>
              {/* Quality Button */}
              <div className="relative">
                <button
                  onClick={() => { setShowQualityMenu(!showQualityMenu); resetHideTimer(); }}
                  disabled={!isReady || isChangingQuality}
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/90 hover:bg-white text-black text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md relative"
                  aria-label="Video Quality"
                >
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {availableQualities.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#0099ff] text-white text-xs rounded-full flex items-center justify-center">
                      {availableQualities.length}
                    </span>
                  )}
                </button>

                {showQualityMenu && (
                  <div className="absolute bottom-full right-0 mb-2 bg-black/95 text-white rounded-lg shadow-xl overflow-hidden min-w-40 z-50">
                    <div className="px-3 py-2 text-xs font-semibold text-gray-400 border-b border-gray-700">
                      Video Quality {isChangingQuality && '(Changing...)'}
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {availableQualities.length > 0 ? availableQualities.map((quality) => (
                        <button
                          key={quality}
                          onClick={() => handleQualityChange(quality)}
                          disabled={isChangingQuality}
                          className={`w-full px-4 py-2.5 text-sm font-medium text-left hover:bg-[#0099ff] transition-colors flex items-center justify-between ${currentQuality === quality ? 'bg-[#0099ff]/20 text-[#0099ff]' : ''
                            } ${isChangingQuality ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <span>{formatQualityLabel(quality)}</span>
                          {currentQuality === quality && !isChangingQuality && (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                          )}
                        </button>
                      )) : (
                        <div className="px-4 py-3 text-sm text-gray-400">Loading qualities...</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Fullscreen Button */}
              <button
                onClick={handleFullscreen}
                disabled={!isReady}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/90 hover:bg-white text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                aria-label="Fullscreen"
              >
                {isFullscreen ? (
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4m0 5H4m11-5v5m0 0h5M9 20v-5m0 0H4m11 5v-5m0 0h5" />
                  </svg>
                ) : (
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      )}


      {/* ── MOBILE CONTROLS ── */}
      {isMobile && (
        <div
          className={`absolute inset-0 z-30 flex flex-col justify-between transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
        >
          {/* Top gradient */}
          <div className="h-16 bg-linear-to-b from-black/60 to-transparent" />

          {/* Center play controls */}
          <div className="flex items-center justify-center gap-8">
            {/* Backward 10s */}
            <button
              onClick={(e) => { e.stopPropagation(); handleBackward(); }}
              disabled={!isReady || isChangingQuality}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-black/50 text-white active:bg-black/70 disabled:opacity-40"
              aria-label="Backward 10 seconds"
            >
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
              </svg>
            </button>

            {/* Play/Pause */}
            <button
              onClick={(e) => { e.stopPropagation(); if (isReady && !isChangingQuality) togglePlayPause(); }}
              disabled={!isReady || isChangingQuality}
              className="w-16 h-16 flex items-center justify-center rounded-full bg-white/95 text-black active:scale-95 transition-transform disabled:opacity-40 shadow-2xl"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg width="30" height="30" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" /></svg>
              ) : (
                <svg width="30" height="30" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              )}
            </button>

            {/* Forward 10s */}
            <button
              onClick={(e) => { e.stopPropagation(); handleForward(); }}
              disabled={!isReady || isChangingQuality}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-black/50 text-white active:bg-black/70 disabled:opacity-40"
              aria-label="Forward 10 seconds"
            >
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
              </svg>
            </button>
          </div>

          {/* Bottom controls */}
          <div className="bg-linear-to-t from-black/90 via-black/60 to-transparent px-3 pb-3 pt-8">
            {/* Progress Bar */}
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={(e) => { e.stopPropagation(); handleSeek(e); }}
              onClick={(e) => e.stopPropagation()}
              className="mobile-seek w-full h-1.5 bg-gray-500 rounded-lg appearance-none cursor-pointer mb-2
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:bg-[#0099ff] [&::-webkit-slider-thumb]:rounded-full
                [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4
                [&::-moz-range-thumb]:bg-[#0099ff] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none"
            />

            {/* Bottom row: time + quality + fullscreen */}
            <div className="flex items-center justify-between">
              {/* Time */}
              <span className="text-white text-xs font-semibold tabular-nums">
                {formatTime(currentTime)}
                <span className="text-white/50 mx-1">/</span>
                {duration > 0 ? formatTime(duration) : '--:--'}
              </span>

              {/* Right: quality + fullscreen */}
              <div className="flex items-center gap-2" ref={qualityMenuRef}>
                {/* Quality Button */}
                <div className="relative">
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowQualityMenu(!showQualityMenu); resetHideTimer(); }}
                    disabled={!isReady || isChangingQuality}
                    className="w-8 h-8 flex items-center justify-center rounded-md bg-white/20 text-white active:bg-white/30 disabled:opacity-40 relative"
                    aria-label="Video Quality"
                  >
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {availableQualities.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#0099ff] text-white text-[9px] rounded-full flex items-center justify-center">
                        {availableQualities.length}
                      </span>
                    )}
                  </button>

                  {/* Mobile Quality Dropdown - opens upward */}
                  {showQualityMenu && (
                    <div className="absolute bottom-full right-0 mb-2 bg-black/95 text-white rounded-lg shadow-xl overflow-hidden w-36 z-50">
                      <div className="px-3 py-2 text-xs font-semibold text-gray-400 border-b border-gray-700">
                        Quality {isChangingQuality && '...'}
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {availableQualities.length > 0 ? availableQualities.map((quality) => (
                          <button
                            key={quality}
                            onClick={(e) => { e.stopPropagation(); handleQualityChange(quality); }}
                            disabled={isChangingQuality}
                            className={`w-full px-3 py-2 text-sm text-left hover:bg-[#0099ff] transition-colors flex items-center justify-between ${currentQuality === quality ? 'bg-[#0099ff]/20 text-[#0099ff]' : ''
                              } ${isChangingQuality ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <span>{formatQualityLabel(quality)}</span>
                            {currentQuality === quality && !isChangingQuality && (
                              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                              </svg>
                            )}
                          </button>
                        )) : (
                          <div className="px-3 py-2 text-xs text-gray-400">Loading...</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Fullscreen Button */}
                <button
                  onClick={(e) => { e.stopPropagation(); handleFullscreen(); }}
                  disabled={!isReady}
                  className="w-8 h-8 flex items-center justify-center rounded-md bg-white/20 text-white active:bg-white/30 disabled:opacity-40"
                  aria-label="Fullscreen"
                >
                  {isFullscreen ? (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4m0 5H4m11-5v5m0 0h5M9 20v-5m0 0H4m11 5v-5m0 0h5" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Center play button for paused state (desktop only) */}
      {!isMobile && !isPlaying && isReady && !isChangingQuality && (
        <button
          onClick={togglePlayPause}
          className="absolute inset-0 flex items-center justify-center z-20 group/play"
          aria-label="Play"
        >
          <div className="w-24 h-24 rounded-full bg-white/95 hover:bg-white flex items-center justify-center transition-all shadow-2xl group-hover/play:scale-110">
            <svg width="40" height="40" fill="black" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          </div>
        </button>
      )}
    </div>
  );
}
