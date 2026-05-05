'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { teacherService, Teacher, CreateTeacherWithImageData } from '@/lib/api/teacherService';

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [newTeacherCredentials, setNewTeacherCredentials] = useState<{ email: string; password: string; teacher: Teacher } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');

  const [formData, setFormData] = useState<CreateTeacherWithImageData>({
    name: '',
    category: '',
    phoneNumber: '',
    image: '',
    imageFile: undefined,
  });

  const categories = [
    'Web Development',
    'Digital Marketing',
    'Mobile Development',
    'Data Science',
    'UI/UX Design',
    'Cloud Computing',
    'Cybersecurity',
    'Artificial Intelligence',
    'Machine Learning',
    'DevOps',
    'Other',
  ];

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      setLoading(true);
      const response = await teacherService.getAllTeachers();
      if (response.success) {
        setTeachers(response.data.teachers);
      } else {
        setError('Failed to load teachers');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load teachers');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUploading(true);
      const response = await teacherService.createTeacher(formData);
      if (response.success) {
        setNewTeacherCredentials(response.data);
        setShowCredentialsModal(true);
        setShowAddModal(false);
        setFormData({ name: '', category: '', phoneNumber: '', image: '', imageFile: undefined });
        setImagePreview('');
        await loadTeachers();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create teacher');
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, imageFile: file });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setFormData({ ...formData, image: '', imageFile: undefined });
    setImagePreview('');
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeletingId(id);
      await teacherService.deleteTeacher(id);
      await loadTeachers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete teacher');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleActive = async (teacher: Teacher) => {
    try {
      await teacherService.updateTeacher(teacher._id, { isActive: !teacher.isActive });
      await loadTeachers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update teacher');
    }
  };

  const handleRegenerateCredentials = async (id: string) => {
    if (!confirm('This will generate new credentials for the teacher. The old password will no longer work. Continue?')) {
      return;
    }

    try {
      const response = await teacherService.regenerateCredentials(id);
      if (response.success) {
        setNewTeacherCredentials(response.data);
        setShowCredentialsModal(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to regenerate credentials');
    }
  };

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch = searchTerm === '' ||
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.teacherId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === '' || teacher.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const copyCredentials = () => {
    if (newTeacherCredentials) {
      const text = `Email: ${newTeacherCredentials.email}\nPassword: ${newTeacherCredentials.password}`;
      navigator.clipboard.writeText(text);
      alert('Credentials copied to clipboard!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Teachers</h2>
          <p className="text-sm text-gray-600">
            Manage teachers and their credentials
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-2 bg-linear-to-r from-[#003399] via-[#0099ff] to-[#00d4ff] text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/40 transition-colors"
        >
          + Add Teacher
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-3 sm:p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search teachers..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0099ff]-500 bg-white text-gray-900 placeholder-gray-400"
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0099ff]-500 bg-white text-gray-900"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('');
            }}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Teachers Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-4 text-center text-gray-500">Loading teachers...</td></tr>
              ) : filteredTeachers.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-4 text-center text-gray-500">No teachers found</td></tr>
              ) : (
                filteredTeachers.map((teacher) => (
                  <tr key={teacher._id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {teacher.image ? (
                          <div className="relative w-12 h-12 mr-4 shrink-0">
                            <Image
                              src={teacher.image}
                              alt={teacher.name}
                              fill
                              className="rounded-full object-cover"
                              sizes="48px"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#003399] via-[#0099ff] to-[#00d4ff] flex items-center justify-center text-white font-semibold mr-4 shrink-0">
                            {teacher.name[0]}
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                          <div className="text-sm text-gray-500">{teacher.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">{teacher.teacherId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{teacher.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{teacher.phoneNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleActive(teacher)}
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          teacher.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {teacher.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRegenerateCredentials(teacher._id)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                          </svg>
                          <span>Reset Password</span>
                        </button>
                        <button
                          onClick={() => handleDelete(teacher._id, teacher.name)}
                          disabled={deletingId === teacher._id}
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 hover:shadow-lg hover:shadow-red-500/40 transition-all duration-200 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>{deletingId === teacher._id ? '...' : 'Delete'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile card list */}
        <div className="md:hidden divide-y divide-gray-100">
          {loading ? (
            <p className="px-4 py-6 text-center text-gray-500 text-sm">Loading teachers...</p>
          ) : filteredTeachers.length === 0 ? (
            <p className="px-4 py-6 text-center text-gray-500 text-sm">No teachers found</p>
          ) : (
            filteredTeachers.map((teacher) => (
              <div key={teacher._id} className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                  {teacher.image ? (
                    <div className="relative w-12 h-12 shrink-0">
                      <Image
                        src={teacher.image}
                        alt={teacher.name}
                        fill
                        className="rounded-full object-cover"
                        sizes="48px"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#003399] via-[#0099ff] to-[#00d4ff] flex items-center justify-center text-white font-semibold shrink-0">
                      {teacher.name[0]}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{teacher.name}</p>
                    <p className="text-xs text-gray-500">{teacher.email}</p>
                    <p className="text-xs text-gray-400 mt-1 font-mono">{teacher.teacherId}</p>
                  </div>
                  <button
                    onClick={() => handleToggleActive(teacher)}
                    className={`px-2 py-0.5 text-xs font-semibold rounded-full shrink-0 ${
                      teacher.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {teacher.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>{teacher.category}</span>
                  <span>{teacher.phoneNumber}</span>
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => handleRegenerateCredentials(teacher._id)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    <span>Reset Password</span>
                  </button>
                  <button
                    onClick={() => handleDelete(teacher._id, teacher.name)}
                    disabled={deletingId === teacher._id}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>{deletingId === teacher._id ? '...' : 'Delete'}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Teacher Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Add New Teacher</h3>
              <p className="text-sm text-gray-500 mt-1">
                Teacher credentials will be auto-generated and shown after creation
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0099ff]-500"
                  placeholder="John Smith"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0099ff]-500"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0099ff]-500"
                  placeholder="+8801234567890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Image
                </label>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="mb-3 flex items-center gap-3">
                    <div className="relative w-20 h-20">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="rounded-full object-cover border-2 border-gray-200"
                        sizes="80px"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={clearImage}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Remove Image
                    </button>
                  </div>
                )}

                {/* File Input */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={uploading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0099ff]-500 bg-white text-gray-900 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />

                {/* URL Input (Alternative) */}
                {!imagePreview && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">Or paste an image URL:</p>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0099ff]-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setFormData({ name: '', category: '', phoneNumber: '', image: '', imageFile: undefined });
                    setImagePreview('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 px-4 py-2 bg-linear-to-r from-[#003399] via-[#0099ff] to-[#00d4ff] text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/40 transition-colors disabled:opacity-50"
                >
                  {uploading ? 'Creating...' : 'Create Teacher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Credentials Modal */}
      {showCredentialsModal && newTeacherCredentials && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-green-600">Teacher Created Successfully!</h3>
              <p className="text-sm text-gray-500 mt-1">
                Please save these credentials securely. You won't be able to see the password again.
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600 uppercase tracking-wider">Email</label>
                    <p className="text-sm font-mono text-gray-900 break-all mt-1">{newTeacherCredentials.email}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 uppercase tracking-wider">Password</label>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm font-mono text-gray-900">{newTeacherCredentials.password}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 uppercase tracking-wider">Teacher ID</label>
                    <p className="text-sm font-mono text-gray-900 mt-1">{newTeacherCredentials.teacher.teacherId}</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-xs text-yellow-800">
                  <strong>Important:</strong> Share these credentials with the teacher. They can log in and change their password from their dashboard.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={copyCredentials}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </button>
                <button
                  onClick={() => {
                    setShowCredentialsModal(false);
                    setNewTeacherCredentials(null);
                  }}
                  className="flex-1 px-4 py-2 bg-linear-to-r from-[#003399] via-[#0099ff] to-[#00d4ff] text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/40 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
