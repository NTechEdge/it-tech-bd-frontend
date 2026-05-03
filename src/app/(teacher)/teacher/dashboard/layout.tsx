'use client';

import TeacherDashboardLayout from '@/components/teacher/TeacherDashboardLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <TeacherDashboardLayout>{children}</TeacherDashboardLayout>;
}
