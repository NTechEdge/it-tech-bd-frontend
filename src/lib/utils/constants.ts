/**
 * API endpoint constants
 */
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',

  // User
  PROFILE: '/user/profile',
  UPDATE_PROFILE: '/user/profile',

  // Courses
  COURSES: '/courses',
  COURSE_DETAIL: (id: string) => `/courses/${id}`,
  COURSE_CONTENT: (id: string) => `/courses/${id}/content`,
  COURSE_PROGRESS: (id: string) => `/courses/${id}/progress`,

  // Students
  STUDENTS: '/admin/students',
  STUDENT_DETAIL: (id: string) => `/admin/students/${id}`,
  STUDENT_PROGRESS: (id: string) => `/admin/students/${id}/progress`,

  // Payments
  PAYMENTS: '/admin/payments',
  PAYMENT_DETAIL: (id: string) => `/admin/payments/${id}`,

  // Dashboard
  DASHBOARD_STATS: '/dashboard/stats',
} as const;

/**
 * HTTP status codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * Pagination defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

/**
 * Date formats
 */
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  INPUT: 'YYYY-MM-DD',
  API: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
} as const;

/**
 * Storage keys
 */
export const STORAGE_KEYS = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;
