'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { adminService, Course, CreateCourseData, CourseSection, CourseLesson } from '@/lib/api/adminService';

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
  instructorId: '',
  sections: [],
  isActive: true,
};

export default function CourseFormPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  const isEditing = courseId !== 'new';

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [admins, setAdmins] = useState<Array<{ _id: string; name: string }>>([]);
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
      const instructorsResponse = await adminService.getInstructors();
      if (instructorsResponse.success) {
        setAdmins(instructorsResponse.data.admins);
        // Auto-select first admin if creating new course
        if (!isEditing && instructorsResponse.data.admins.length > 0) {
          setFormData((prev) => ({ ...prev, instructorId: instructorsResponse.data.admins[0]._id }));
        }
      }

      // Load course data if editing
      if (isEditing) {
        const courseResponse = await adminService.getCourseById(courseId);
        if (courseResponse.success) {
          const course = courseResponse.data;
          setFormData({
            title: course.title,
            category: course.category,
            thumbnailUrl: course.thumbnailUrl,
            shortDesc: course.shortDesc,
            fullDesc: course.fullDesc,
            price: course.price,
            level: course.level,
            instructorId: typeof course.instructorId === 'string' ? course.instructorId : course.instructorId._id,
            sections: course.sections,
            isActive: course.isActive,
          });
        }
      }
    } catch (err) {
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

    // Validation
    if (!formData.title || !formData.category || !formData.thumbnailUrl || !formData.shortDesc || !formData.fullDesc) {
      setError('Please fill in all required fields');
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
        instructorId: formData.instructorId,
        sections: formData.sections,
        isActive: formData.isActive,
      };

      if (isEditing) {
        await adminService.updateCourse(courseId, submitData);
      } else {
        await adminService.createCourse(submitData);
      }

      router.push('/admin/dashboard/courses');
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${isEditing ? 'update' : 'create'} course`);
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Course' : 'Create New Course'}
          </h2>
          <p className="text-sm text-gray-600">
            {isEditing ? 'Update course information' : 'Fill in the course details'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push('/admin/dashboard/courses')}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-900 placeholder-gray-400"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-900 placeholder-gray-400"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-900 placeholder-gray-400"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-900"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-900 placeholder-gray-400"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-900 placeholder-gray-400"
                placeholder="Complete course covering HTML, CSS, JavaScript..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instructor *
              </label>
              <select
                required
                value={formData.instructorId}
                onChange={(e) => setFormData({ ...formData, instructorId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-900"
              >
                <option value="">Select an instructor</option>
                {admins.map((admin) => (
                  <option key={admin._id} value={admin._id}>
                    {admin.name} (You)
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">The logged-in admin user will be assigned as the course instructor</p>
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
                  formData.isActive ? 'bg-orange-500' : 'bg-gray-200'
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
                <img src={formData.thumbnailUrl} alt="Thumbnail" className="h-32 w-56 object-cover rounded" />
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-900 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
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
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
            >
              + Add Section
            </button>
          </div>

          {(!formData.sections || formData.sections.length === 0) ? (
            <p className="text-gray-500 text-center py-8">No sections added yet. Click "Add Section" to start.</p>
          ) : (
            <div className="space-y-6">
              {formData.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => updateSection(sectionIndex, e.target.value)}
                      placeholder={`Section ${sectionIndex + 1} Title`}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-900 placeholder-gray-400 mr-4"
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
                      <div key={lessonIndex} className="border rounded p-3 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
                          <input
                            type="text"
                            value={lesson.title}
                            onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'title', e.target.value)}
                            placeholder="Lesson title"
                            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-900 placeholder-gray-400"
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
                            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-900 placeholder-gray-400"
                            required
                          />
                          <div className="flex gap-2">
                            <input
                              type="number"
                              value={lesson.durationSeconds}
                              onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'durationSeconds', parseInt(e.target.value) || 0)}
                              placeholder="Duration (seconds)"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-900 placeholder-gray-400"
                            />
                            <button
                              type="button"
                              onClick={() => removeLesson(sectionIndex, lessonIndex)}
                              className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
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
                    className="mt-3 px-4 py-2 border border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-orange-500 hover:text-orange-600 transition-colors text-sm w-full"
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
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : isEditing ? 'Update Course' : 'Create Course'}
          </button>
        </div>
      </form>
    </div>
  );
}
