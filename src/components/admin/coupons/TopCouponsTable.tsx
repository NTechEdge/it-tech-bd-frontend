import { CouponStats } from "@/lib/api/couponService";

interface TopCouponsTableProps {
  stats: CouponStats;
}

export default function TopCouponsTable({ stats }: TopCouponsTableProps) {
  if (!stats.topCoupons || stats.topCoupons.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Top Performing Coupons</h2>
        <p className="text-sm text-gray-500 mt-1">Coupons with the most usage</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Coupon Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Times Used
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Discount Given
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {stats.topCoupons.map((coupon, index) => (
              <tr key={index} className={index === 0 ? "bg-green-50" : "hover:bg-gray-50"}>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <span className={`text-sm font-medium ${index === 0 ? "text-green-700" : "text-gray-900"}`}>
                      {coupon.code}
                    </span>
                    {index === 0 && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        #1
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600">{coupon.description}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-gray-900">{coupon.usageCount}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-green-600">
                    TK {coupon.totalDiscountAmount.toLocaleString()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
