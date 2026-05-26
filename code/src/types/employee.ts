export interface Employee {
  employee_id: number;

  auth_id: string;

  name: string;
  email: string;

  job_title: string;

  avatar_url?: string;
  bio?: string;

  created_at?: string;
}