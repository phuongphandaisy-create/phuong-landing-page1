// User Types
export interface User {
  id: string;
  username: string;
  password: string;
  createdAt: Date;
}

// Blog Types
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  authorId: string;
  author: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogFormData {
  title: string;
  content: string;
  excerpt: string;
}

// Contact Types
export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: Date;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

// API Response Types
export interface ApiError {
  success: false;
  error: {
    message: string;
    code: string;
    details?: any;
  };
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

// Auth Types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthSession {
  user: {
    id: string;
    username: string;
  };
}