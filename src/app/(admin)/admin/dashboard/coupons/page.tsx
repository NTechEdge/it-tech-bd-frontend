"use client";

import { useState, useEffect } from "react";
import { adminService } from "@/lib/api/adminService";
import { Coupon, CouponStats } from "@/lib/api/couponService";
import CouponStatsCards from "@/components/admin/coupons/CouponStatsCards";
import CouponTable from "@/components/admin/coupons/CouponTable";
import CouponFormModal from "@/components/admin/coupons/CouponFormModal";
import DeleteConfirmModal from "@/components/admin/coupons/DeleteConfirmModal";
import TopCouponsTable from "@/components/admin/coupons/TopCouponsTable";

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [stats, setStats] = useState<CouponStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [deletingCoupon, setDeletingCoupon] = useState<Coupon | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [filters, setFilters] = useState({
    status: "",
    scope: "",
    search: ""
  });

  useEffect(() => {
    loadCoupons();
    loadStats();
  }, [pagination.page, filters]);

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllCoupons({
        page: pagination.page,
        limit: pagination.limit,
        status: filters.status as any || undefined,
        scope: filters.scope as any || undefined,
        search: filters.search || undefined
      });
      setCoupons(response.data.coupons);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error loading coupons:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await adminService.getCouponStats();
      setStats(response.data);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const handleCreate = () => {
    setEditingCoupon(null);
    setShowModal(true);
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setShowModal(true);
  };

  const handleDelete = (coupon: Coupon) => {
    setDeletingCoupon(coupon);
    setShowDeleteModal(true);
  };

  const handleSave = async (data: any) => {
    try {
      if (editingCoupon) {
        await adminService.updateCoupon(editingCoupon._id, data);
      } else {
        await adminService.createCoupon(data);
      }
      setShowModal(false);
      loadCoupons();
      loadStats();
    } catch (error: any) {
      console.error("Error saving coupon:", error);
      throw error;
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingCoupon) return;

    try {
      await adminService.deleteCoupon(deletingCoupon._id);
      setShowDeleteModal(false);
      loadCoupons();
      loadStats();
    } catch (error: any) {
      console.error("Error deleting coupon:", error);
      alert(error.message || "Failed to delete coupon");
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination({ ...pagination, page: newPage });
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
    setPagination({ ...pagination, page: 1 });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Discount Coupons</h1>
          <p className="text-gray-600 mt-1">Manage and track discount coupons for courses</p>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#003399] via-[#0099ff] to-[#00d4ff] text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/40 transition-all font-medium"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Coupon
        </button>
      </div>

      {/* Stats Cards */}
      {stats && <CouponStatsCards stats={stats} />}

      {/* Top Performing Coupons */}
      {stats && <TopCouponsTable stats={stats} />}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search by code or description..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Scope</label>
            <select
              value={filters.scope}
              onChange={(e) => handleFilterChange("scope", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Scopes</option>
              <option value="all">All Courses</option>
              <option value="specific">Specific Courses</option>
              <option value="category">Category Based</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setFilters({ status: "", scope: "", search: "" })}
              className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Coupons Table */}
      <CouponTable
        coupons={coupons}
        loading={loading}
        pagination={pagination}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPageChange={handlePageChange}
      />

      {/* Create/Edit Modal */}
      {showModal && (
        <CouponFormModal
          coupon={editingCoupon}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingCoupon && (
        <DeleteConfirmModal
          coupon={deletingCoupon}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}
