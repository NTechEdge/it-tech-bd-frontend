'use client';

interface BannerIndicatorsProps {
  totalCount: number;
  currentIndex: number;
  onIndicatorClick?: (index: number) => void;
}

export default function BannerIndicators({ totalCount, currentIndex, onIndicatorClick }: BannerIndicatorsProps) {
  if (totalCount <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 py-2">
      {Array.from({ length: totalCount }).map((_, index) => (
        <button
          key={index}
          onClick={() => onIndicatorClick?.(index)}
          className={`transition-all duration-300 rounded-full ${
            currentIndex === index
              ? 'w-6 h-2 bg-linear-to-r from-orange-500 to-orange-600'
              : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
          }`}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
}
