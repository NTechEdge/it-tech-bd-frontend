import { CouponStats } from "@/lib/api/couponService";

interface CouponStatsCardsProps {
  stats: CouponStats;
}

export default function CouponStatsCards({ stats }: CouponStatsCardsProps) {
  // Calculate unique users who used coupons from top coupons data
  const uniqueUsersCount = stats.topCoupons?.reduce((sum, coupon) => sum + (coupon.usageCount || 0), 0) || 0;

  const cards = [
    {
      title: "Total Coupons",
      value: stats.overview.totalCoupons || 0,
      change: `${stats.overview.activeCoupons || 0} active`,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      color: "blue"
    },
    {
      title: "Total Redemptions",
      value: stats.usage.totalUsage || stats.overview.totalUsageCount || 0,
      change: `${stats.overview.totalUsageCount || 0} times coupons were used`,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "green"
    },
    {
      title: "Total Discount",
      value: `TK ${(stats.usage.totalDiscountAmount || 0).toLocaleString()}`,
      change: `From TK ${(stats.usage.totalOriginalAmount || 0).toLocaleString()} sales`,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "purple"
    },
    {
      title: "Active Rate",
      value: `${(stats.overview.totalCoupons || 0) > 0 ? Math.round(((stats.overview.activeCoupons || 0) / (stats.overview.totalCoupons || 1)) * 100) : 0}%`,
      change: `${stats.overview.expiredCoupons || 0} expired`,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      color: "orange"
    }
  ];

  const colorClasses = {
    blue: {
      bg: "bg-blue-50",
      icon: "bg-blue-500",
      text: "text-blue-600"
    },
    green: {
      bg: "bg-green-50",
      icon: "bg-green-500",
      text: "text-green-600"
    },
    purple: {
      bg: "bg-purple-50",
      icon: "bg-purple-500",
      text: "text-purple-600"
    },
    orange: {
      bg: "bg-orange-50",
      icon: "bg-orange-500",
      text: "text-orange-600"
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const colors = colorClasses[card.color as keyof typeof colorClasses];
        return (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-lg ${colors.icon} bg-opacity-10`}>
                <div className={colors.icon}>{card.icon}</div>
              </div>
              <div className={`text-sm font-medium ${colors.text}`}>{card.change}</div>
            </div>
            <div className="mt-4">
              <h3 className="text-gray-500 text-sm font-medium">{card.title}</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
