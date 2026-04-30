# Loading States

A collection of unique loading state components for different contexts in your application.

## Available Components

### Full Page Loading States

- **`CourseLoadingState`** - For the courses browsing page
  - Dual-ring spinner with book icon
  - Messages: "Loading courses..." / "Finding the best courses for you"

- **`MyCoursesLoadingState`** - For the user's enrolled courses page
  - Blue spinner with layered document icon
  - Messages: "Loading your courses..." / "Preparing your learning journey"

- **`CourseDetailLoadingState`** - For individual course detail pages
  - Large spinner with play button icon
  - Messages: "Loading course details..." / "Preparing your learning experience"

- **`AuthLoadingState`** - For authentication states
  - Shield icon with pulse animation
  - Messages: "Verifying your credentials..." / "Please wait while we secure your session"

### Card/Section Loading States

- **`DashboardCardLoadingState`** - For dashboard widgets
  - Small inline spinner with customizable message
  - Props: `message?: string` (default: "Loading...")

- **`StatsCardLoadingState`** - For statistics cards
  - Skeleton/pulse animation for card placeholder

### Table Loading States

- **`TableLoadingState`** - For admin tables
  - Bouncing dots animation
  - Props: `colSpan?: number` (default: 7), `message?: string` (default: "Loading...")

- **`MobileListLoadingState`** - For mobile card lists
  - Small inline spinner for mobile views

### Context-Specific Loading States

- **`EnrollmentLoadingState`** - For enrollment processing
  - Green spinner with checkmark icon
  - Messages: "Processing enrollment..." / "Please wait"

- **`VideoLoadingState`** - For video player loading
  - Dark-themed spinner with play icon
  - Message: "Loading video player..."

- **`PaymentLoadingState`** - For payment processing
  - Green-themed spinner with card icon
  - Messages: "Processing payment..." / "Please don't close this window"

- **`AnalyticsLoadingState`** - For analytics dashboards
  - Multiple skeleton cards

- **`SearchLoadingState`** - For search operations
  - Small spinner with search icon
  - Message: "Searching..."

## Usage

Import from the index file:

```tsx
import { CourseLoadingState, DashboardCardLoadingState, TableLoadingState } from '@/components/ui/loading-states';

// Full page loading
if (loading) {
  return <CourseLoadingState />;
}

// Card loading
{loading ? (
  <DashboardCardLoadingState message="Loading your courses..." />
) : (
  // content
)}

// Table loading
{loading ? (
  <TableLoadingState colSpan={7} message="Loading courses..." />
) : (
  // content
)}
```
