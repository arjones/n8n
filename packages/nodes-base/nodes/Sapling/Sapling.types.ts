
export interface SaplingError {
  message: string,
  status: number
}

export interface Person {
  guid: string,
  first_name: string,
  last_name: string,
  start_date: Date,
  email: string,
  employment_status?: string,
  job_title?: string,
  preferred_name?: string,
  status?: string,
  [key: string]: unknown
}

export interface SaplingCollection<T> {
  current_page: number,
  total_pages: number,
  status: number,
  [key: string]: T[] | number
}

export interface SaplingUsers extends SaplingCollection<Person> {
  total_users: number,
  users: Person[]
}

export interface SaplingUser {
  user: Person
}
