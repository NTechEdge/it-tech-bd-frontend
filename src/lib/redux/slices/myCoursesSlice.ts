import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { httpClient } from '@/lib/utils/httpClient';

export interface LessonProgress {
  lessonId: string;
  watchTimeSeconds: number;
  isCompleted: boolean;
}

export interface CourseBanInfo {
  isBanned: boolean;
  banReason?: string;
  banExpiresAt?: string;
}

export interface EnrolledCourse {
  enrollment: {
    id: string;
    purchasedAt: string;
    amount: number;
    paymentStatus: 'pending' | 'approved' | 'rejected';
    progress: LessonProgress[];
    courseBan: CourseBanInfo;
  };
  course: {
    _id: string;
    title: string;
    category: string;
    thumbnailUrl: string;
    shortDesc: string;
    fullDesc: string;
    price: number;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    instructorName: string;
    sections: Array<{
      title: string;
      lessons: Array<{
        title: string;
        youtubeUrl: string;
        youtubeId: string;
        durationSeconds: number;
      }>;
    }>;
    isActive: boolean;
    createdAt: string;
  };
}

type ApiRecord = Record<string, unknown>;

interface CourseProgress {
  progressPercentage: number;
  totalLessons: number;
  completedLessons: number;
}

interface MyCoursesState {
  enrolledCourses: EnrolledCourse[];
  loading: boolean;
  error: string | null;
  courseProgress: Record<string, CourseProgress>;
}

const initialState: MyCoursesState = {
  enrolledCourses: [],
  loading: false,
  error: null,
  courseProgress: {},
};

const isRecord = (value: unknown): value is ApiRecord =>
  typeof value === 'object' && value !== null;

const getStringId = (value: unknown): string => {
  if (typeof value === 'string') return value;
  if (isRecord(value)) {
    const id = value._id ?? value.id ?? value.$oid;
    return typeof id === 'string' ? id : '';
  }
  return '';
};

const getString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback;

const getNumber = (value: unknown, fallback = 0): number =>
  typeof value === 'number' ? value : fallback;

const getPaymentStatus = (value: unknown): EnrolledCourse['enrollment']['paymentStatus'] => {
  return value === 'approved' || value === 'rejected' || value === 'pending' ? value : 'pending';
};

const getLevel = (value: unknown): EnrolledCourse['course']['level'] => {
  return value === 'Intermediate' || value === 'Advanced' || value === 'Beginner'
    ? value
    : 'Beginner';
};

const getCourse = (value: unknown): EnrolledCourse['course'] | null => {
  if (!isRecord(value)) return null;

  const id = getStringId(value);
  if (!id) return null;

  const sections = Array.isArray(value.sections) ? value.sections : [];

  return {
    _id: id,
    title: getString(value.title, 'Untitled Course'),
    category: getString(value.category),
    thumbnailUrl: getString(value.thumbnailUrl),
    shortDesc: getString(value.shortDesc),
    fullDesc: getString(value.fullDesc),
    price: getNumber(value.price),
    level: getLevel(value.level),
    instructorName: getString(value.instructorName, 'Instructor'),
    sections: sections as EnrolledCourse['course']['sections'],
    isActive: typeof value.isActive === 'boolean' ? value.isActive : true,
    createdAt: getString(value.createdAt),
  };
};

const getResponseItems = (response: unknown): unknown[] => {
  const data = isRecord(response) ? response.data : response;
  if (Array.isArray(data)) return data;
  if (isRecord(data) && Array.isArray(data.enrollments)) return data.enrollments;
  if (isRecord(data) && Array.isArray(data.courses)) return data.courses;
  return [];
};

const fetchCourseById = async (courseId: string): Promise<EnrolledCourse['course'] | null> => {
  if (!courseId) return null;

  try {
    const response = await httpClient.get<{ success: boolean; data: unknown }>(`/courses/${courseId}`);
    return getCourse(response.data);
  } catch {
    return null;
  }
};

const normalizeEnrollment = async (item: unknown): Promise<EnrolledCourse | null> => {
  if (!isRecord(item)) return null;

  const nestedEnrollment = isRecord(item.enrollment) ? item.enrollment : item;
  const courseId = getStringId(item.courseId ?? nestedEnrollment.courseId);
  const course =
    getCourse(item.course) ||
    getCourse(item.courseId) ||
    (courseId ? await fetchCourseById(courseId) : null);

  if (!course) return null;

  const id = getStringId(nestedEnrollment._id ?? nestedEnrollment.id) || `${course._id}-${getString(nestedEnrollment.purchasedAt)}`;

  // Extract courseBan info
  const rawCourseBan = isRecord(nestedEnrollment.courseBan) ? nestedEnrollment.courseBan : null;
  const courseBan: CourseBanInfo = {
    isBanned: rawCourseBan ? Boolean(rawCourseBan.isBanned) : false,
    banReason: rawCourseBan && typeof rawCourseBan.banReason === 'string' ? rawCourseBan.banReason : undefined,
    banExpiresAt: rawCourseBan && typeof rawCourseBan.banExpiresAt === 'string' ? rawCourseBan.banExpiresAt : undefined,
  };

  return {
    enrollment: {
      id,
      purchasedAt: getString(nestedEnrollment.purchasedAt),
      amount: getNumber(nestedEnrollment.amount),
      paymentStatus: getPaymentStatus(nestedEnrollment.paymentStatus),
      progress: Array.isArray(nestedEnrollment.progress)
        ? (nestedEnrollment.progress as LessonProgress[])
        : [],
      courseBan,
    },
    course,
  };
};

export const fetchMyCourses = createAsyncThunk(
  'myCourses/fetchMyCourses',
  async () => {
    const response = await httpClient.get<unknown>('/students/my-courses');
    const normalizedCourses = await Promise.all(getResponseItems(response).map(normalizeEnrollment));
    return normalizedCourses.filter((course): course is EnrolledCourse => Boolean(course));
  }
);

export const fetchCourseProgress = createAsyncThunk(
  'myCourses/fetchCourseProgress',
  async (courseId: string) => {
    const response = await httpClient.get<{
      success: boolean;
      data: { progressPercentage: number; totalLessons: number; completedLessons: number };
    }>(`/students/progress/${courseId}`);
    return { courseId, progress: response.data };
  }
);

const myCoursesSlice = createSlice({
  name: 'myCourses',
  initialState,
  reducers: {
    clearMyCourses: (state) => {
      state.enrolledCourses = [];
      state.error = null;
    },
    upsertEnrolledCourse: (state, action: PayloadAction<EnrolledCourse>) => {
      const incoming = action.payload;
      const existingIndex = state.enrolledCourses.findIndex(
        (ec) => ec.course._id === incoming.course._id
      );

      if (existingIndex >= 0) {
        state.enrolledCourses[existingIndex] = incoming;
      } else {
        state.enrolledCourses.unshift(incoming);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyCourses.fulfilled, (state, action) => {
        state.loading = false;
        const serverCourses = action.payload;
        const serverCourseIds = new Set(serverCourses.map((ec) => ec.course._id));
        const localPendingCourses = state.enrolledCourses.filter(
          (ec) =>
            ec.enrollment.paymentStatus === 'pending' &&
            !serverCourseIds.has(ec.course._id)
        );

        state.enrolledCourses = [...localPendingCourses, ...serverCourses];
      })
      .addCase(fetchMyCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch courses';
      })
      .addCase(fetchCourseProgress.fulfilled, (state, action) => {
        state.courseProgress[action.payload.courseId] = action.payload.progress;
      });
  },
});

export const { clearMyCourses, upsertEnrolledCourse } = myCoursesSlice.actions;

export const selectEnrolledCourseIds = (state: { myCourses: MyCoursesState }) =>
  state.myCourses.enrolledCourses
    .filter((ec) => ec.enrollment.paymentStatus === 'approved')
    .map((ec) => ec.course._id);

export const selectIsEnrolled = (state: { myCourses: MyCoursesState }, courseId: string) =>
  state.myCourses.enrolledCourses.some(
    (ec) => ec.course._id === courseId && ec.enrollment.paymentStatus === 'approved'
  );

export default myCoursesSlice.reducer;
