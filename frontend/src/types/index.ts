export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface UploadResponse {
  _id: string;
  originalName: string;
  filename: string;
  mimetype: string;
  size: number;
  url: string;
  uploadedBy: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  token?: string;
}
