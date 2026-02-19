export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}
