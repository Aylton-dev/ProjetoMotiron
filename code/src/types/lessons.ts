export interface Lessons {
  lesson_id: number;
  module_id: number;
  title: string;
  description: string | null;
  video_url: string;
  materials_url: string | null;
  order_index: number;
  created_at: string;
}