'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { adminService, Course, CreateCourseData, CourseSection, CourseLesson } from '@/lib/api/adminService';
import { teacherService, TeacherForDropdown } from '@/lib/api/teacherService';

interface FormData extends CreateCourseData {
  thumbnailFile?: File;
}

const initialFormData: FormData = {
  title: '',
  category: '',
  thumbnailUrl: '',
  shortDesc: '',
  fullDesc: '',
  price: 0,
  level: 'Beginner',
  teacherId: '',
  isInstructorAdmin: false,
  sections: [],
  isActive: true,
};

export default function CourseFormPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  const isEditing = courseId !== 'new';

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [teachers, setTeachers] = useState<TeacherForDropdown[]>([]);
  const [admins, setAdmins] = useState<Array<{ _id: string; name: string; email: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, [courseId]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load admin instructors
      const adminsResponse = await adminService.getInstructors();
      console.log('Admins response:', adminsResponse);
      if (adminsResponse.success) {
        setAdmins(adminsResponse.data.admins);
        console.log(`Found ${adminsResponse.data.admins.length} admins`);
      } else {
        console.error('Failed to load admins:', adminsResponse);
      }

      // Load available teachers
      const teachersResponse = await teacherService.getAvailableTeachers();
      console.log('Teachers response:', teachersResponse);
      console.log('Teachers data:', teachersResponse.data);
      if (teachersResponse.success) {
        console.log(`Found ${teachersResponse.data.teachers.length} teachers`);
        setTeachers(teachersResponse.data.teachers);
      } else {
        console.error('Failed to load teachers:', teachersResponse);
      }

      // Load course data if editing (after teachers and admins are loaded)
      if (isEditing) {
        const courseResponse = await adminService.getCourseById(courseId);
        if (courseResponse.success) {
          const course = courseResponse.data;
          console.log('Loaded course data:', course);

          // Handle teacherId - could be string, object, or undefined (for old courses with instructorId)
          let teacherIdValue = '';
          let isInstructorAdminValue = false;

          if (course.teacherId) {
            const teacherIdStr = typeof course.teacherId === 'string' ? course.teacherId : course.teacherId._id;
            teacherIdValue = teacherIdStr;

            // Check if this is a teacher or admin by looking up in our lists
            // First, try to find in teachers list (by their userId)
            const teacher = teachersResponse.data.teachers.find((t: any) => t.id === teacherIdStr);
            if (teacher) {
              isInstructorAdminValue = false;
              // Use the teacher's _id for the dropdown
              teacherIdValue = teacher.id;
            } else {
              // Check if it's an admin
              const admin = adminsResponse.data.admins.find((a: any) => a._id === teacherIdStr);
              if (admin) {
                isInstructorAdminValue = true;
              } else {
                // Not found in either list - default to admin behavior
                isInstructorAdminValue = true;
              }
            }
          } else if ((course as any).instructorId) {
            // Backward compatibility: old courses might have instructorId
            const oldInstructorId = (course as any).instructorId;
            teacherIdValue = typeof oldInstructorId === 'string' ? oldInstructorId : oldInstructorId._id;
            isInstructorAdminValue = true;
          }

          console.log('Setting instructor:', { teacherIdValue, isInstructorAdminValue });

          setFormData({
            title: course.title,
            category: course.category,
            thumbnailUrl: course.thumbnailUrl,
            shortDesc: course.shortDesc,
            fullDesc: course.fullDesc,
            price: course.price,
            level: course.level,
            teacherId: teacherIdValue,
            isInstructorAdmin: isInstructorAdminValue,
            sections: course.sections,
            isActive: course.isActive,
          });
        }
      } else {
        // Auto-select first available instructor if creating new course
        if (adminsResponse.data.admins.length > 0) {
          const firstAdminId = adminsResponse.data.admins[0]._id;
          console.log('Auto-selecting first admin:', firstAdminId);
          setFormData((prev) => ({ ...prev, teacherId: firstAdminId, isInstructorAdmin: true }));
        } else if (teachersResponse.data.teachers.length > 0) {
          const firstTeacherId = teachersResponse.data.teachers[0].id;
          console.log('Auto-selecting first teacher:', firstTeacherId);
          setFormData((prev) => ({ ...prev, teacherId: firstTeacherId, isInstructorAdmin: false }));
        }
      }

      // Log if no instructors available
      if (!isEditing && !formData.teacherId) {
        const adminCount = adminsResponse.success ? adminsResponse.data.admins.length : 0;
        const teacherCount = teachersResponse.success ? teachersResponse.data.teachers.length : 0;
        const totalInstructors = adminCount + teacherCount;
        console.warn(`No instructors selected. Admins: ${adminCount}, Teachers: ${teacherCount}`);
        if (totalInstructors === 0) {
          setError('No instructors available. Please create an admin user or teacher first before creating a course.');
        }
      }
    } catch (err) {
      console.error('Error loading course form data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const response = await adminService.uploadThumbnail(file);
      if (response.success) {
        setFormData({ ...formData, thumbnailUrl: response.data.url });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload thumbnail');
    } finally {
      setUploading(false);
    }
  };

  const addSection = () => {
    setFormData({
      ...formData,
      sections: [...(formData.sections || []), { title: '', lessons: [] }],
    });
  };

  const updateSection = (index: number, title: string) => {
    const newSections = [...(formData.sections || [])];
    newSections[index].title = title;
    setFormData({ ...formData, sections: newSections });
  };

  const removeSection = (index: number) => {
    const newSections = (formData.sections || []).filter((_, i) => i !== index);
    setFormData({ ...formData, sections: newSections });
  };

  const addLesson = (sectionIndex: number) => {
    const newSections = [...(formData.sections || [])];
    newSections[sectionIndex].lessons.push({
      title: '',
      youtubeUrl: '',
      youtubeId: '',
      durationSeconds: 0,
    });
    setFormData({ ...formData, sections: newSections });
  };

  const updateLesson = (sectionIndex: number, lessonIndex: number, field: keyof CourseLesson, value: string | number) => {
    const newSections = [...(formData.sections || [])];
    newSections[sectionIndex].lessons[lessonIndex] = {
      ...newSections[sectionIndex].lessons[lessonIndex],
      [field]: value,
    };
    setFormData({ ...formData, sections: newSections });
  };

  const removeLesson = (sectionIndex: number, lessonIndex: number) => {
    const newSections = [...(formData.sections || [])];
    newSections[sectionIndex].lessons = newSections[sectionIndex].lessons.filter((_, i) => i !== lessonIndex);
    setFormData({ ...formData, sections: newSections });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation - check each field individually for better error messages
    if (!formData.title?.trim()) {
      setError('Course Title is required');
      return;
    }
    if (!formData.category?.trim()) {
      setError('Category is required');
      return;
    }
    if (!formData.thumbnailUrl?.trim()) {
      setError('Please upload a course thumbnail');
      return;
    }
    if (!formData.shortDesc?.trim()) {
      setError('Short Description is required');
      return;
    }
    if (!formData.fullDesc?.trim()) {
      setError('Full Description is required');
      return;
    }

    // Check teacherId specifically
    if (!formData.teacherId) {
      console.error('Instructor ID is missing or empty. Current value:', formData.teacherId);
      console.error('Available admins:', admins);
      console.error('Available teachers:', teachers);
      setError('Please select an instructor. If no instructors are available, please create an admin user or teacher first.');
      return;
    }

    // Validate teacherId format (MongoDB ObjectId is 24 character hex string)
    const teacherIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!teacherIdRegex.test(formData.teacherId)) {
      console.error('Invalid instructorId format:', formData.teacherId);
      setError('Invalid instructor ID format. Please re-select an instructor from the dropdown.');
      return;
    }

    if (!formData.sections || formData.sections.length === 0) {
      setError('Please add at least one section');
      return;
    }

    for (let i = 0; i < formData.sections.length; i++) {
      if (!formData.sections[i].title) {
        setError(`Section ${i + 1} title is required`);
        return;
      }
      for (let j = 0; j < formData.sections[i].lessons.length; j++) {
        const lesson = formData.sections[i].lessons[j];
        if (!lesson.title || !lesson.youtubeUrl) {
          setError(`Section ${i + 1}, Lesson ${j + 1}: Title and YouTube URL are required`);
          return;
        }
      }
    }

    try {
      setSaving(true);

      const submitData: CreateCourseData = {
        title: formData.title,
        category: formData.category,
        thumbnailUrl: formData.thumbnailUrl,
        shortDesc: formData.shortDesc,
        fullDesc: formData.fullDesc,
        price: formData.price,
        level: formData.level,
        teacherId: formData.teacherId,
        isInstructorAdmin: formData.isInstructorAdmin,
        sections: formData.sections,
        isActive: formData.isActive,
      };

      console.log('Submitting course data...');
      console.log('teacherId:', formData.teacherId, 'Type:', typeof formData.teacherId);
      console.log('isInstructorAdmin:', formData.isInstructorAdmin);
      console.log('Full submit data:', JSON.stringify(submitData, null, 2));

      if (isEditing) {
        await adminService.updateCourse(courseId, submitData);
      } else {
        const result = await adminService.createCourse(submitData);
        console.log('Course creation result:', result);
      }

      router.push('/admin/dashboard/courses');
    } catch (err: any) {
      console.error('Course submission error:', err);

      // Handle validation errors from backend
      if (err.response?.data?.errors) {
        const validationErrors = err.response.data.errors;
        const errorMessages = validationErrors.map((e: any) => e.msg || e.message).join(', ');
        setError(`Validation error: ${errorMessages}`);
        return;
      }

      // Handle other errors
      let errorMessage = `Failed to ${isEditing ? 'update' : 'create'} course`;

      if (err instanceof Error) {
        const errorLower = err.message.toLowerCase();

        if (errorLower.includes('teacher') || errorLower.includes('instructor')) {
          errorMessage = 'Instructor error: The selected instructor may not be valid. Please try selecting a different instructor or contact support.';
        } else if (errorLower.includes('validation') || errorLower.includes('required')) {
          errorMessage = `Validation error: ${err.message}`;
        } else if (errorLower.includes('network') || errorLower.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Course' : 'Create New Course'}
          </h2>
          <p className="text-sm text-gray-600">
            {isEditing ? 'Update course information' : 'Fill in the course details'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push('/admin/dashboard/courses')}
          className="self-start sm:self-auto px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
        >
          Back to Courses
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0099ff] bg-white text-gray-900 placeholder-gray-400"
                  placeholder="Complete Web Development"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0099ff] bg-white text-gray-900 placeholder-gray-400"
                  placeholder="Web Development"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (TK) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0099ff] bg-white text-gray-900 placeholder-gray-400"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Level *
                </label>
                <select
                  required
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0099ff] bg-white text-gray-900"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Short Description * (max 200 chars)
              </label>
              <input
                type="text"
                required
                maxLength={200}
                value={formData.shortDesc}
                onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0099ff] bg-white text-gray-900 placeholder-gray-400"
                placeholder="Learn web development from scratch"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Description *
              </label>
              <textarea
                required
                value={formData.fullDesc}
                onChange={(e) => setFormData({ ...formData, fullDesc: e.target.value })}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0099ff] bg-white text-gray-900 placeholder-gray-400"
                placeholder="Complete course covering HTML, CSS, JavaScript..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instructor *
              </label>
              <select
                required
                value={formData.teacherId}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const isAdmin = admins.some(a => a._id === selectedId);
                  setFormData({ ...formData, teacherId: selectedId, isInstructorAdmin: isAdmin });
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0099ff] bg-white text-gray-900 ${
                  admins.length === 0 && teachers.length === 0 ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                disabled={admins.length === 0 && teachers.length === 0}
              >
                <option value="">Select an instructor</option>
                {admins.length > 0 && (
                  <optgroup label="Administrators">
                    {admins.map((admin) => (
                      <option key={admin._id} value={admin._id}>
                        {admin.name} (Admin)
                      </option>
                    ))}
                  </optgroup>
                )}
                {teachers.length > 0 && (
                  <optgroup label="Teachers">
                    {teachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.name} - {teacher.category}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
              {admins.length === 0 && teachers.length === 0 ? (
                <div className="mt-1">
                  <p className="text-xs text-red-600 font-medium">⚠️ No instructors available</p>
                  <p className="text-xs text-gray-600 mt-1">You need to create an admin user or teacher first before creating a course.</p>
                  <div className="flex gap-3 mt-1">
                    <button
                      type="button"
                      onClick={() => router.push('/admin/dashboard/teachers')}
                      className="text-xs text-[#0099ff] hover:underline inline-flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Teachers Page
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.teacherId
                      ? (() => {
                        const admin = admins.find((a) => a._id === formData.teacherId);
                        const teacher = teachers.find((t) => t.id === formData.teacherId);
                        if (admin) {
                          return `Selected: ${admin.name} (Admin)`;
                        } else if (teacher) {
                          return `Selected: ${teacher.name} - ${teacher.category} (Teacher)`;
                        }
                        return 'Selected: Unknown';
                      })()
                      : 'Select an administrator or teacher for this course'
                    }
                  </p>
                  {!formData.teacherId && (
                    <p className="text-xs text-amber-600 mt-0.5">⚠️ Please select an instructor before submitting</p>
                  )}
                </>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Active Course
                </label>
                <p className="text-xs text-gray-500">Inactive courses won't be visible to students</p>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.isActive ? 'bg-linear-to-r from-[#003399] via-[#0099ff] to-[#00d4ff]' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.isActive ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Thumbnail */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Thumbnail</h3>
          <div className="space-y-4">
            {formData.thumbnailUrl && (
              <div className="flex items-center gap-4">
                <div className="relative h-32 w-56 shrink-0">
                  <Image
                    src={formData.thumbnailUrl}
                    alt="Thumbnail"
                    fill
                    className="object-cover rounded"
                    sizes="224px"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current thumbnail</p>
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload New Thumbnail
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailUpload}
                disabled={uploading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0099ff] bg-white text-gray-900 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {uploading && <p className="text-sm text-gray-600 mt-1">Uploading...</p>}
            </div>
          </div>
        </div>

        {/* Sections & Lessons */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Course Content</h3>
            <button
              type="button"
              onClick={addSection}
              className="px-4 py-2 bg-linear-to-r from-[#003399] via-[#0099ff] to-[#00d4ff] text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/40 transition-colors text-sm"
            >
              + Add Section
            </button>
          </div>

          {(!formData.sections || formData.sections.length === 0) ? (
            <p className="text-gray-500 text-center py-8">No sections added yet. Click "Add Section" to start.</p>
          ) : (
            <div className="space-y-6">
              {formData.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => updateSection(sectionIndex, e.target.value)}
                      placeholder={`Section ${sectionIndex + 1} Title`}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0099ff] bg-white text-gray-900 placeholder-gray-400 mr-4"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeSection(sectionIndex)}
                      className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
                    >
                      Remove Section
                    </button>
                  </div>

                  <div className="space-y-2">
                    {section.lessons.map((lesson, lessonIndex) => (
                      <div key={lessonIndex} className="border border-gray-200 rounded p-3 bg-gray-50 overflow-hidden">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-2">
                          <input
                            type="text"
                            value={lesson.title}
                            onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'title', e.target.value)}
                            placeholder="Lesson title"
                            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0099ff] bg-white text-gray-900 placeholder-gray-400"
                            required
                          />
                          <input
                            type="text"
                            value={lesson.youtubeUrl}
                            onChange={(e) => {
                              updateLesson(sectionIndex, lessonIndex, 'youtubeUrl', e.target.value);
                              // Extract YouTube ID
                              const match = e.target.value.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
                              if (match) {
                                updateLesson(sectionIndex, lessonIndex, 'youtubeId', match[1]);
                              }
                            }}
                            placeholder="YouTube URL"
                            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0099ff] bg-white text-gray-900 placeholder-gray-400"
                            required
                          />
                          <div className="flex gap-2 min-w-0">
                            <input
                              type="number"
                              value={lesson.durationSeconds}
                              onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'durationSeconds', parseInt(e.target.value) || 0)}
                              placeholder="Duration (seconds)"
                              className="min-w-0 flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0099ff] bg-white text-gray-900 placeholder-gray-400"
                            />
                            <button
                              type="button"
                              onClick={() => removeLesson(sectionIndex, lessonIndex)}
                              className="shrink-0 px-3 py-1 text-sm text-red-600 hover:text-red-800"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => addLesson(sectionIndex)}
                    className="mt-3 px-4 py-2 border border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-[#0099ff] hover:text-[#0099ff] transition-colors text-sm w-full"
                  >
                    + Add Lesson
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.push('/admin/dashboard/courses')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-linear-to-r from-[#003399] via-[#0099ff] to-[#00d4ff] text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/40 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : isEditing ? 'Update Course' : 'Create Course'}
          </button>
        </div>
      </form>
    </div>
  );
}
