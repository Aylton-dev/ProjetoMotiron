export interface Enrollments {
  enrollment_id: number;

  employee_id: number;
  course_id: number;

  progress: number;

  start_date?: string;

  created_at?: string;
}