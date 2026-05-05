/**
 * Performance monitoring utilities for production
 * Track Web Vitals and custom performance metrics
 */

export interface WebVitalMetric {
  id: string;
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

/**
 * Report Web Vitals to analytics service
 * Call this from app/layout.tsx with the web-vitals library
 */
export function reportWebVitals(metric: any) {
  const { id, name, value, rating } = metric;

  const vital: WebVitalMetric = {
    id,
    name,
    value,
    rating,
    timestamp: Date.now(),
  };

  // Log in development for debugging
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vital:', vital);
  }

  // Send to analytics in production
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to your analytics service
    // sendToAnalytics(vital);

    // You can integrate with:
    // - Google Analytics
    // - Vercel Analytics
    // - Custom analytics endpoint
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', name, {
        event_category: 'Web Vitals',
        event_label: id,
        value: Math.round(value),
        custom_map: { metric_value: 'value' },
      });
    }
  }
}

/**
 * Measure page load performance
 */
export function measurePageLoad() {
  if (typeof window === 'undefined') return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (!perfData) return;

      const metrics = {
        // DNS lookup time
        dns: Math.round(perfData.domainLookupEnd - perfData.domainLookupStart),
        // TCP connection time
        tcp: Math.round(perfData.connectEnd - perfData.connectStart),
        // Request time
        request: Math.round(perfData.responseStart - perfData.requestStart),
        // Response time
        response: Math.round(perfData.responseEnd - perfData.responseStart),
        // DOM processing time
        domProcessing: Math.round(perfData.domComplete - perfData.domInteractive),
        // Total load time
        totalLoad: Math.round(perfData.loadEventEnd - perfData.fetchStart),
      };

      if (process.env.NODE_ENV === 'development') {
        console.log('Page Load Metrics:', metrics);
      }

      // Send to analytics in production
      if (process.env.NODE_ENV === 'production' && typeof (window as any).gtag === 'function') {
        (window as any).gtag('event', 'page_load_timing', {
          event_category: 'Performance',
          ...metrics,
        });
      }
    }, 0);
  });
}

/**
 * Measure custom performance marks
 */
export function measurePerformanceMark(name: string, startMark?: string) {
  if (typeof window === 'undefined') return;

  const markName = startMark ? `${startMark}-${name}` : name;

  try {
    if (startMark) {
      performance.measure(markName, startMark, name);
    } else {
      performance.mark(name);
    }

    const measure = performance.getEntriesByName(markName)[0];
    if (measure) {
      return measure.duration;
    }
  } catch (error) {
    console.warn('Performance measurement error:', error);
  }

  return 0;
}

/**
 * Log API response times
 */
export function logApiPerformance(endpoint: string, duration: number) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`API [${duration}ms]:`, endpoint);
  }

  // Slow API warnings (> 2 seconds)
  if (duration > 2000) {
    console.warn(`Slow API detected: ${endpoint} took ${duration}ms`);
  }

  // Send to analytics in production
  if (process.env.NODE_ENV === 'production' && typeof (window as any).gtag === 'function') {
    (window as any).gtag('event', 'api_request', {
      event_category: 'API Performance',
      event_label: endpoint,
      value: Math.round(duration),
    });
  }
}
