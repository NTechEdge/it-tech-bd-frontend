import CourseListPanel from "./components/CourseListPanel";
import CourseDetailPanel from "./components/CourseDetailPanel";

export default function MyCoursesPage() {
  return (
    <div className="flex h-full">
      <CourseListPanel />
      <CourseDetailPanel />
    </div>
  );
}
