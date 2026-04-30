import { Chapter } from "../components/CourseContent";

export interface Course {
  id: string;
  title: string;
  description: string;
  videoId: string;
  instructor: {
    name: string;
    title: string;
    avatar: string;
  };
  rating: number;
  reviews: number;
  totalDuration: string;
  price: number;
  level: string;
  badgeColor: string;
}

export interface CourseWithChapters extends Course {
  chapters: Chapter[];
}

// Course 1: Redux Toolkit
export const courseData: Course = {
  id: "1",
  title: "Redux Toolkit Complete Course 2026",
  description: "Master Redux Toolkit from beginner to advanced. Learn state management, async thunks, and build real-world projects with modern best practices.",
  videoId: "Q5TqsetwCoE",
  instructor: {
    name: "John Developer",
    title: "Senior Software Engineer",
    avatar: "JD",
  },
  rating: 5,
  reviews: 324,
  totalDuration: "4h 30m",
  price: 1200,
  level: "Beginner to Advanced",
  badgeColor: "bg-green-100 text-green-700",
};

export const courseChapters: Chapter[] = [
  {
    id: "ch-1",
    title: "Introduction & Setup",
    lessons: [
      { id: "lesson-1", title: "Course Introduction", duration: "5:00", startTime: 0, completed: true },
      { id: "lesson-2", title: "What is Redux?", duration: "8:30", startTime: 320, completed: true },
      { id: "lesson-3", title: "Environment Setup", duration: "12:15", startTime: 630, completed: false },
    ],
  },
  {
    id: "ch-2",
    title: "Redux Fundamentals",
    lessons: [
      { id: "lesson-4", title: "Redux Basics", duration: "10:20", startTime: 920, completed: false },
      { id: "lesson-5", title: "Store Setup", duration: "15:40", startTime: 1360, completed: false },
      { id: "lesson-6", title: "Actions & Reducers", duration: "18:00", startTime: 2040, completed: false },
    ],
  },
  {
    id: "ch-3",
    title: "Redux Toolkit",
    lessons: [
      { id: "lesson-7", title: "Introduction to Redux Toolkit", duration: "12:00", startTime: 3120, completed: false },
      { id: "lesson-8", title: "Slice Creation", duration: "22:15", startTime: 3840, completed: false },
      { id: "lesson-9", title: "Configure Store", duration: "14:30", startTime: 4500, completed: false },
    ],
  },
  {
    id: "ch-4",
    title: "Advanced Concepts",
    lessons: [
      { id: "lesson-10", title: "Async Thunk Basics", duration: "18:45", startTime: 5460, completed: false },
      { id: "lesson-11", title: "API Integration", duration: "25:00", startTime: 6285, completed: false },
      { id: "lesson-12", title: "Error Handling", duration: "15:20", startTime: 8160, completed: false },
    ],
  },
  {
    id: "ch-5",
    title: "Real-World Project",
    lessons: [
      { id: "lesson-13", title: "Project Overview", duration: "8:00", startTime: 9240, completed: false },
      { id: "lesson-14", title: "Building the App", duration: "35:00", startTime: 10080, completed: false },
      { id: "lesson-15", title: "Deployment", duration: "12:00", startTime: 12000, completed: false },
    ],
  },
];

// Course 2: React JS Complete
export const reactCourseData: Course = {
  id: "2",
  title: "Complete React JS Course | MERN Stack Development",
  description: "Master React.js from fundamentals to advanced concepts. Build modern web applications with hooks, context API, Redux, and prepare for full-stack MERN development.",
  videoId: "E6tAtRi82QY",
  instructor: {
    name: "Sarah Khan",
    title: "Full Stack Developer",
    avatar: "SK",
  },
  rating: 5,
  reviews: 512,
  totalDuration: "6h 45m",
  price: 1500,
  level: "Beginner to Advanced",
  badgeColor: "bg-blue-100 text-blue-700",
};

export const reactCourseChapters: Chapter[] = [
  {
    id: "react-ch-1",
    title: "Getting Started with React",
    lessons: [
      { id: "react-lesson-1", title: "Introduction to React", duration: "10:00", startTime: 0, completed: false },
      { id: "react-lesson-2", title: "Setting Up Development Environment", duration: "15:30", startTime: 600, completed: false },
      { id: "react-lesson-3", title: "Your First React Component", duration: "12:45", startTime: 1530, completed: false },
      { id: "react-lesson-4", title: "JSX Deep Dive", duration: "18:20", startTime: 2295, completed: false },
    ],
  },
  {
    id: "react-ch-2",
    title: "React Fundamentals",
    lessons: [
      { id: "react-lesson-5", title: "Props and Component Communication", duration: "22:00", startTime: 3395, completed: false },
      { id: "react-lesson-6", title: "State Management Basics", duration: "25:30", startTime: 4715, completed: false },
      { id: "react-lesson-7", title: "Event Handling in React", duration: "16:45", startTime: 6245, completed: false },
      { id: "react-lesson-8", title: "Conditional Rendering", duration: "14:20", startTime: 7245, completed: false },
    ],
  },
  {
    id: "react-ch-3",
    title: "React Hooks",
    lessons: [
      { id: "react-lesson-9", title: "Introduction to Hooks", duration: "11:00", startTime: 8105, completed: false },
      { id: "react-lesson-10", title: "useState Hook Deep Dive", duration: "20:30", startTime: 8765, completed: false },
      { id: "react-lesson-11", title: "useEffect Hook Complete Guide", duration: "28:45", startTime: 9995, completed: false },
      { id: "react-lesson-12", title: "Custom Hooks", duration: "18:15", startTime: 11720, completed: false },
    ],
  },
  {
    id: "react-ch-4",
    title: "Advanced React Concepts",
    lessons: [
      { id: "react-lesson-13", title: "Context API for State Management", duration: "24:00", startTime: 12835, completed: false },
      { id: "react-lesson-14", title: "useReducer Hook", duration: "19:30", startTime: 14275, completed: false },
      { id: "react-lesson-15", title: "React Router v6", duration: "32:00", startTime: 15445, completed: false },
      { id: "react-lesson-16", title: "Form Handling", duration: "21:15", startTime: 17365, completed: false },
    ],
  },
  {
    id: "react-ch-5",
    title: "MERN Stack Integration",
    lessons: [
      { id: "react-lesson-17", title: "Introduction to MERN Stack", duration: "14:00", startTime: 18620, completed: false },
      { id: "react-lesson-18", title: "Connecting React with Node.js", duration: "26:30", startTime: 19460, completed: false },
      { id: "react-lesson-19", title: "REST API Integration", duration: "30:45", startTime: 21050, completed: false },
      { id: "react-lesson-20", title: "Building Full MERN Application", duration: "45:00", startTime: 22895, completed: false },
    ],
  },
  {
    id: "react-ch-6",
    title: "Project & Deployment",
    lessons: [
      { id: "react-lesson-21", title: "Final Project Overview", duration: "12:00", startTime: 25595, completed: false },
      { id: "react-lesson-22", title: "Building E-commerce App", duration: "55:00", startTime: 26315, completed: false },
      { id: "react-lesson-23", title: "Testing React Applications", duration: "22:30", startTime: 29615, completed: false },
      { id: "react-lesson-24", title: "Deployment to Production", duration: "18:00", startTime: 30965, completed: false },
    ],
  },
];

// Course 3: Docker + AWS
export const dockerAwsCourseData: Course = {
  id: "3",
  title: "Complete Docker + AWS | Deploy Your First Project",
  description: "Master containerization with Docker and cloud deployment with AWS. Learn to deploy applications from scratch, including EC2, ECR, ECS, and more.",
  videoId: "Uf6PXnagtsg",
  instructor: {
    name: "Mike Anderson",
    title: "DevOps Engineer",
    avatar: "MA",
  },
  rating: 5,
  reviews: 428,
  totalDuration: "5h 20m",
  price: 1800,
  level: "Beginner to Intermediate",
  badgeColor: "bg-blue-100 text-blue-700",
};

export const dockerAwsCourseChapters: Chapter[] = [
  {
    id: "docker-ch-1",
    title: "Introduction to DevOps",
    lessons: [
      { id: "docker-lesson-1", title: "What is DevOps?", duration: "12:00", startTime: 0, completed: false },
      { id: "docker-lesson-2", title: "Why Docker & AWS?", duration: "10:30", startTime: 720, completed: false },
      { id: "docker-lesson-3", title: "Course Overview", duration: "8:00", startTime: 1350, completed: false },
    ],
  },
  {
    id: "docker-ch-2",
    title: "Docker Fundamentals",
    lessons: [
      { id: "docker-lesson-4", title: "What is Docker?", duration: "15:00", startTime: 1830, completed: false },
      { id: "docker-lesson-5", title: "Installing Docker", duration: "12:30", startTime: 2730, completed: false },
      { id: "docker-lesson-6", title: "Docker Architecture", duration: "18:00", startTime: 3480, completed: false },
      { id: "docker-lesson-7", title: "Your First Docker Container", duration: "20:00", startTime: 4560, completed: false },
    ],
  },
  {
    id: "docker-ch-3",
    title: "Docker in Practice",
    lessons: [
      { id: "docker-lesson-8", title: "Dockerfile Deep Dive", duration: "25:00", startTime: 5760, completed: false },
      { id: "docker-lesson-9", title: "Docker Compose", duration: "22:00", startTime: 7260, completed: false },
      { id: "docker-lesson-10", title: "Multi-Container Apps", duration: "18:30", startTime: 8580, completed: false },
      { id: "docker-lesson-11", title: "Docker Volumes & Networks", duration: "16:00", startTime: 9690, completed: false },
    ],
  },
  {
    id: "docker-ch-4",
    title: "AWS Basics",
    lessons: [
      { id: "docker-lesson-12", title: "Introduction to AWS", duration: "14:00", startTime: 10650, completed: false },
      { id: "docker-lesson-13", title: "AWS Account Setup", duration: "11:30", startTime: 11490, completed: false },
      { id: "docker-lesson-14", title: "AWS EC2 Overview", duration: "20:00", startTime: 12180, completed: false },
      { id: "docker-lesson-15", title: "Launching Your First EC2", duration: "25:00", startTime: 13380, completed: false },
    ],
  },
  {
    id: "docker-ch-5",
    title: "Deploying with AWS",
    lessons: [
      { id: "docker-lesson-16", title: "Docker + AWS Integration", duration: "22:00", startTime: 14880, completed: false },
      { id: "docker-lesson-17", title: "Amazon ECR (Container Registry)", duration: "18:00", startTime: 16200, completed: false },
      { id: "docker-lesson-18", title: "Amazon ECS (Container Service)", duration: "28:00", startTime: 17280, completed: false },
      { id: "docker-lesson-19", title: "Deploying Your App", duration: "35:00", startTime: 18960, completed: false },
    ],
  },
  {
    id: "docker-ch-6",
    title: "Production Deployment",
    lessons: [
      { id: "docker-lesson-20", title: "CI/CD Pipeline", duration: "24:00", startTime: 21060, completed: false },
      { id: "docker-lesson-21", title: "Load Balancing", duration: "16:30", startTime: 22500, completed: false },
      { id: "docker-lesson-22", title: "Auto Scaling", duration: "14:00", startTime: 23490, completed: false },
      { id: "docker-lesson-23", title: "Final Deployment Project", duration: "40:00", startTime: 24330, completed: false },
    ],
  },
];

// All courses with their chapters
export const allCourses: CourseWithChapters[] = [
  {
    ...courseData,
    chapters: courseChapters,
  },
  {
    ...reactCourseData,
    chapters: reactCourseChapters,
  },
  {
    ...dockerAwsCourseData,
    chapters: dockerAwsCourseChapters,
  },
];

// Helper function to get course by ID
export function getCourseById(courseId: string): CourseWithChapters | undefined {
  return allCourses.find(course => course.id === courseId);
}

// Default course (backward compatibility)
export const defaultCourseId = "1";
