import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

interface CourseProgress {
  courseId: string;
  completedLessons: string[];
  currentLesson: string | null;
  progressPercentage: number;
  lastAccessed: string;
}

interface PurchasedCourse {
  _id: string;
  orderItemId: string;
  product: {
    _id: string;
    name: string;
    slug: string;
    description: string;
    thumbnail: string;
    images: Array<{ url: string; publicId: string }>;
    price: number;
    instructor?: {
      _id: string;
      name: string;
    };
    level?: string;
    duration?: number;
    rating: {
      average: number;
      count: number;
    };
  };
  orderNumber: string;
  purchaseDate: string;
  status: 'active' | 'completed' | 'cancelled';
  progress?: CourseProgress;
  accessExpiry?: string;
}

interface MyCoursesState {
  purchasedCourses: PurchasedCourse[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  courseProgress: Record<string, CourseProgress>;
}

const initialState: MyCoursesState = {
  purchasedCourses: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  },
  courseProgress: {},
};

// Async thunks
export const fetchMyCourses = createAsyncThunk(
  'myCourses/fetchMyCourses',
  async (params: { page?: number; limit?: number; status?: string } = {}, { getState }) => {
    const token = localStorage.getItem('token');
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.status) queryParams.append('status', params.status);

    const response = await axios.get(`${API_URL}/orders/my?${queryParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
);

export const fetchCourseProgress = createAsyncThunk(
  'myCourses/fetchCourseProgress',
  async (courseId: string, { getState }) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/courses/${courseId}/progress`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { courseId, progress: response.data.data };
  }
);

export const updateCourseProgress = createAsyncThunk(
  'myCourses/updateCourseProgress',
  async ({ courseId, lessonId, completed }: { courseId: string; lessonId: string; completed: boolean }, { getState }) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/courses/${courseId}/progress`,
      { lessonId, completed },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { courseId, progress: response.data.data };
  }
);

export const isCoursePurchased = createAsyncThunk(
  'myCourses/isCoursePurchased',
  async (courseId: string, { getState }) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/courses/${courseId}/purchased`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { courseId, isPurchased: response.data.data.isPurchased };
  }
);

const myCoursesSlice = createSlice({
  name: 'myCourses',
  initialState,
  reducers: {
    clearMyCourses: (state) => {
      state.purchasedCourses = [];
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch my courses
      .addCase(fetchMyCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyCourses.fulfilled, (state, action) => {
        state.loading = false;
        // Transform order items into purchased courses
        const orders = action.payload.data || action.payload;
        const purchasedCourses: PurchasedCourse[] = [];

        orders.forEach((order: any) => {
          if (order.items && Array.isArray(order.items)) {
            order.items.forEach((item: any, index: number) => {
              purchasedCourses.push({
                _id: `${order._id}-${item._id || index}`,
                orderItemId: item._id || `${order._id}-${index}`,
                product: item.product,
                orderNumber: order.orderNumber,
                purchaseDate: order.createdAt,
                status: order.status === 'delivered' || order.status === 'confirmed' ? 'active' : order.status,
              });
            });
          }
        });

        state.purchasedCourses = purchasedCourses;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchMyCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch my courses';
      })
      // Fetch course progress
      .addCase(fetchCourseProgress.fulfilled, (state, action) => {
        state.courseProgress[action.payload.courseId] = action.payload.progress;
      })
      // Update course progress
      .addCase(updateCourseProgress.fulfilled, (state, action) => {
        state.courseProgress[action.payload.courseId] = action.payload.progress;
      });
  },
});

export const { clearMyCourses, clearError } = myCoursesSlice.actions;

// Selector to get purchased course IDs
export const selectPurchasedCourseIds = (state: { myCourses: MyCoursesState }) => {
  return state.myCourses.purchasedCourses.map(course => course.product._id);
};

// Selector to check if a course is purchased
export const selectIsCoursePurchased = (state: { myCourses: MyCoursesState }, courseId: string) => {
  return state.myCourses.purchasedCourses.some(
    course => course.product._id === courseId && course.status === 'active'
  );
};

export default myCoursesSlice.reducer;
