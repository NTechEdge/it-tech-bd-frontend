import { useState, useEffect, useCallback, memo } from "react";
import { adminService } from "@/lib/api/adminService";
import { Coupon } from "@/lib/api/couponService";

interface CouponFormModalProps {
  coupon: Coupon | null;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

interface Course {
  _id: string;
  title: string;
  category: string;
}

const CouponFormModal = memo(function CouponFormModal({ coupon, onClose, onSave }: CouponFormModalProps) {
  const isEditing = !!coupon;
  const [loading, setLoading] = useState(false);
  const [generatingCode, setGeneratingCode] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "percentage" as "percentage" | "fixed",
    discountValue: "",
    maxDiscountAmount: "",
    scope: "all" as "all" | "specific" | "category",
    applicableCourses: [] as string[],
    applicableCategories: [] as string[],
    minPurchaseAmount: "",
    usageLimit: "",
    perUserLimit: "",
    validFrom: "",
    validUntil: "",
    status: "active" as "active" | "expired" | "disabled"
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadCourses();
    loadCategories();
    if (coupon) {
      setFormData({
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue.toString(),
        maxDiscountAmount: coupon.maxDiscountAmount?.toString() || "",
        scope: coupon.scope,
        applicableCourses: coupon.applicableCourses?.map(c => c._id) || [],
        applicableCategories: coupon.applicableCategories || [],
        minPurchaseAmount: coupon.minPurchaseAmount?.toString() || "",
        usageLimit: coupon.usageLimit.toString(),
        perUserLimit: coupon.perUserLimit.toString(),
        validFrom: new Date(coupon.validFrom).toISOString().split("T")[0],
        validUntil: new Date(coupon.validUntil).toISOString().split("T")[0],
        status: coupon.status
      });
    }
  }, [coupon]);

  const loadCourses = async () => {
    try {
      const response = await adminService.getAllCourses({ includeInactive: false, limit: 1000 });
      setCourses(response.data.courses);
    } catch (error) {
      console.error("Error loading courses:", error);
    }
  };

  const loadCategories = useCallback(async () => {
    try {
      const uniqueCategories = Array.from(new Set(courses.map(c => c.category)));
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  }, [courses]);

  const handleGenerateCode = useCallback(async () => {
    try {
      setGeneratingCode(true);
      const response = await adminService.generateCouponCode(8);
      setFormData({ ...formData, code: response.data.code });
    } catch (error) {
      console.error("Error generating code:", error);
    } finally {
      setGeneratingCode(false);
    }
  }, [formData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) {
      newErrors.code = "Coupon code is required";
    } else if (!/^[A-Z0-9-_]{4,20}$/i.test(formData.code)) {
      newErrors.code = "Code must be 4-20 characters (letters, numbers, hyphens, underscores)";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.discountValue || parseFloat(formData.discountValue) <= 0) {
      newErrors.discountValue = "Discount value must be greater than 0";
    }

    if (formData.discountType === "percentage" && parseFloat(formData.discountValue) > 100) {
      newErrors.discountValue = "Percentage discount cannot exceed 100%";
    }

    if (formData.scope === "specific" && formData.applicableCourses.length === 0) {
      newErrors.applicableCourses = "Select at least one course";
    }

    if (formData.scope === "category" && formData.applicableCategories.length === 0) {
      newErrors.applicableCategories = "Select at least one category";
    }

    if (!formData.usageLimit || parseInt(formData.usageLimit) < 1) {
      newErrors.usageLimit = "Usage limit must be at least 1";
    }

    if (!formData.perUserLimit || parseInt(formData.perUserLimit) < 1) {
      newErrors.perUserLimit = "Per user limit must be at least 1";
    }

    if (!formData.validFrom) {
      newErrors.validFrom = "Valid from date is required";
    }

    if (!formData.validUntil) {
      newErrors.validUntil = "Valid until date is required";
    }

    if (formData.validFrom && formData.validUntil && new Date(formData.validUntil) <= new Date(formData.validFrom)) {
      newErrors.validUntil = "Valid until date must be after valid from date";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const data = {
        code: formData.code.toUpperCase(),
        description: formData.description,
        discountType: formData.discountType,
        discountValue: parseFloat(formData.discountValue),
        maxDiscountAmount: formData.discountType === "percentage" && formData.maxDiscountAmount
          ? parseFloat(formData.maxDiscountAmount)
          : undefined,
        scope: formData.scope,
        applicableCourses: formData.scope === "specific" ? formData.applicableCourses : undefined,
        applicableCategories: formData.scope === "category" ? formData.applicableCategories : undefined,
        minPurchaseAmount: formData.minPurchaseAmount ? parseFloat(formData.minPurchaseAmount) : undefined,
        usageLimit: parseInt(formData.usageLimit),
        perUserLimit: parseInt(formData.perUserLimit),
        validFrom: new Date(formData.validFrom).toISOString(),
        validUntil: new Date(formData.validUntil).toISOString(),
        status: isEditing ? formData.status : undefined
      };
      await onSave(data);
    } catch (error: unknown) {
      setErrors({ submit: (error as Error).message || "Failed to save coupon" });
    } finally {
      setLoading(false);
    }
  }, [formData, isEditing, onSave]);

  const toggleCourse = useCallback((courseId: string) => {
    setFormData({
      ...formData,
      applicableCourses: formData.applicableCourses.includes(courseId)
        ? formData.applicableCourses.filter(id => id !== courseId)
        : [...formData.applicableCourses, courseId]
    });
  }, [formData]);

  const toggleCategory = useCallback((category: string) => {
    setFormData({
      ...formData,
      applicableCategories: formData.applicableCategories.includes(category)
        ? formData.applicableCategories.filter(c => c !== category)
        : [...formData.applicableCategories, category]
    });
  }, [formData]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black opacity-50 transition-opacity" onClick={onClose}></div>

        <div className="relative bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {isEditing ? "Edit Coupon" : "Create New Coupon"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {errors.submit}
              </div>
            )}

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Coupon Code *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.code ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="SUMMER2026"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateCode}
                    disabled={generatingCode}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 font-medium"
                  >
                    {generatingCode ? "..." : "Generate"}
                  </button>
                </div>
                {errors.code && <p className="text-red-600 text-sm mt-1">{errors.code}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Summer sale discount"
                />
                {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
              </div>
            </div>

            {/* Discount Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Type *
                </label>
                <select
                  value={formData.discountType}
                  onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Value *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    className={`w-full px-3 py-2 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.discountValue ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder={formData.discountType === "percentage" ? "20" : "1000"}
                    min="0"
                    step={formData.discountType === "percentage" ? "1" : "0.01"}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    {formData.discountType === "percentage" ? "%" : "৳"}
                  </span>
                </div>
                {errors.discountValue && <p className="text-red-600 text-sm mt-1">{errors.discountValue}</p>}
              </div>

              {formData.discountType === "percentage" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Discount (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.maxDiscountAmount}
                      onChange={(e) => setFormData({ ...formData, maxDiscountAmount: e.target.value })}
                      className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="5000"
                      min="0"
                      step="0.01"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">৳</span>
                  </div>
                </div>
              )}
            </div>

            {/* Scope */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Applicable To *
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="all"
                    checked={formData.scope === "all"}
                    onChange={(e) => setFormData({ ...formData, scope: e.target.value as any })}
                    className="mr-2"
                  />
                  All Courses
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="specific"
                    checked={formData.scope === "specific"}
                    onChange={(e) => setFormData({ ...formData, scope: e.target.value as any })}
                    className="mr-2"
                  />
                  Specific Courses
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="category"
                    checked={formData.scope === "category"}
                    onChange={(e) => setFormData({ ...formData, scope: e.target.value as any })}
                    className="mr-2"
                  />
                  Categories
                </label>
              </div>
            </div>

            {formData.scope === "specific" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Courses *
                </label>
                <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto">
                  {courses.map(course => (
                    <label key={course._id} className="flex items-center py-1 hover:bg-gray-50 px-2 rounded">
                      <input
                        type="checkbox"
                        checked={formData.applicableCourses.includes(course._id)}
                        onChange={() => toggleCourse(course._id)}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{course.title}</div>
                        <div className="text-sm text-gray-500">{course.category}</div>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.applicableCourses && <p className="text-red-600 text-sm mt-1">{errors.applicableCourses}</p>}
              </div>
            )}

            {formData.scope === "category" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Categories *
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <label key={category} className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.applicableCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="mr-2"
                      />
                      {category}
                    </label>
                  ))}
                </div>
                {errors.applicableCategories && <p className="text-red-600 text-sm mt-1">{errors.applicableCategories}</p>}
              </div>
            )}

            {/* Limits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Purchase (Optional)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.minPurchaseAmount}
                    onChange={(e) => setFormData({ ...formData, minPurchaseAmount: e.target.value })}
                    className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">৳</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Usage Limit *
                </label>
                <input
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.usageLimit ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="100"
                  min="1"
                />
                {errors.usageLimit && <p className="text-red-600 text-sm mt-1">{errors.usageLimit}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Per User Limit *
                </label>
                <input
                  type="number"
                  value={formData.perUserLimit}
                  onChange={(e) => setFormData({ ...formData, perUserLimit: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.perUserLimit ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="1"
                  min="1"
                />
                {errors.perUserLimit && <p className="text-red-600 text-sm mt-1">{errors.perUserLimit}</p>}
              </div>
            </div>

            {/* Validity Period */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valid From *
                </label>
                <input
                  type="date"
                  value={formData.validFrom}
                  onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.validFrom ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.validFrom && <p className="text-red-600 text-sm mt-1">{errors.validFrom}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valid Until *
                </label>
                <input
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.validUntil ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.validUntil && <p className="text-red-600 text-sm mt-1">{errors.validUntil}</p>}
              </div>
            </div>

            {isEditing && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-gradient-to-r from-[#003399] via-[#0099ff] to-[#00d4ff] text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/40 transition-all font-medium disabled:opacity-50"
              >
                {loading ? "Saving..." : isEditing ? "Update Coupon" : "Create Coupon"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
});

export default CouponFormModal;
