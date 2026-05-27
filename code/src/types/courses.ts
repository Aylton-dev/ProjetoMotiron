export interface Courses {
  course_id: number;
  category_id: number;

  title: string;
  description: string;

  image_url: string;

  created_at?: string;
}