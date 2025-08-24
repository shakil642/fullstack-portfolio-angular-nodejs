import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SearchResult {
  id: number;
  title: string;
  description: string;
  type: 'project' | 'blog';
  image_url: string;
  slug?: string;
  github_link?: string; 
  live_link?: string;
  tags?: string;
}

export interface Activity {
  id: number;
  text: string;
  type: 'Project' | 'Blog' | 'Review' | 'Message';
  created_at: string;
}

export interface TopSkill {
  topSkill: string;
}

export interface ApprovalRate {
  approvalRate: number;
}

export interface BusiestMonth {
  busiestMonth: string;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
}

export interface ChartData {
  labels: string[];
  data: number[];
}

export interface DashboardStats {
  totalProjects: number;
  totalBlogs: number;
  totalReviews: number;
  totalMessages: number;
  totalVisits: number;
}

export interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  received_at: string;
}

// The PROJECT INTERFACE
export interface Project {
  id: number;
  title: string;
  description: string;
  image_url: string;
  github_link: string;
  live_link: string;
  created_at: string; 
  tags: string;
}

export type CreateProjectDto = Omit<Project, 'id' | 'created_at'>;

//The SKILL INTERFACE
export interface Skills {
  [category: string]: string[];
}

// The BLOG INTERFACE
export interface Blogs {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image_url: string;
  is_published: boolean;
  created_at: string;
}

export interface Review {
  id: number;
  name: string;
  position: string;
  company: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // private apiUrl = 'https://portfolio-backend.onrender.com/api';
   private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  search(query: string): Observable<SearchResult[]> {
    return this.http.get<SearchResult[]>(`${this.apiUrl}/search`, { params: { q: query } });
  }
  
  getBusiestMonth(): Observable<BusiestMonth> {
    return this.http.get<BusiestMonth>(`${this.apiUrl}/dashboard/busiest-month`);
  }

  trackVisit(): Observable<any> {
    return this.http.post(`${this.apiUrl}/visits/track`, {});
  }

  getRecentActivity(): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.apiUrl}/dashboard/recent-activity`);
  }

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/projects`);
  }

  deleteProject(id: number): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.apiUrl}/projects/${id}`);
  }

  createProject(projectData: Partial<Project>): Observable<Project> {
    return this.http.post<Project>(`${this.apiUrl}/projects`, projectData);
  }

  uploadImage(file: File): Observable<{ filePath: string }> {
    const formData = new FormData();
    formData.append('projectImage', file);
    return this.http.post<{ filePath: string }>(`${this.apiUrl}/upload`, formData);
  }

  updateProject(id: number, projectData: Partial<CreateProjectDto>): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/projects/${id}`, projectData);
  }

  getSkills(): Observable<Skills> {
    return this.http.get<Skills>(`${this.apiUrl}/skills`);
  }

  updateSkills(skills: {name: string, category: string}[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/skills`, skills);
  }

  getBlogs(): Observable<Partial<Blogs[]>> {
    return this.http.get<Partial<Blogs[]>>(`${this.apiUrl}/blogs`);
  }

  getBlogBySlug(slug: string): Observable<Blogs> {
    return this.http.get<Blogs>(`${this.apiUrl}/blogs/${slug}`);
  }

  getAllBlogsForAdmin(): Observable<Blogs[]> {
    return this.http.get<Blogs[]>(`${this.apiUrl}/blogs/admin/all`);
  }

  createBlog(blogData: Partial<Blogs>): Observable<Blogs> {
    return this.http.post<Blogs>(`${this.apiUrl}/blogs`, blogData);
  }

  updateBlog(id: number, blogData: Partial<Blogs>): Observable<Blogs> {
    return this.http.put<Blogs>(`${this.apiUrl}/blogs/${id}`, blogData);
  }

  deleteBlog(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/blogs/${id}`);
  }

  getReviewStats(): Observable<ReviewStats> {
    return this.http.get<ReviewStats>(`${this.apiUrl}/reviews/stats`);
  }

  getApprovedReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/reviews`);
  }

  createReview(reviewData: Partial<Review>): Observable<Review> {
    return this.http.post<Review>(`${this.apiUrl}/reviews`, reviewData);
  }

  getAllReviewsForAdmin(): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/reviews/admin`);
  }

  approveReview(id: number): Observable<Review> {
    return this.http.put<Review>(`${this.apiUrl}/reviews/${id}/approve`, {});
  }

  deleteReview(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/reviews/${id}`);
  }

  sendMessage(messageData: { name: string, email: string, message: string }): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/contact`, messageData);
  }

  getAllMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/contact/admin`);
  }

  toggleMessageRead(id: number): Observable<Message> {
    return this.http.put<Message>(`${this.apiUrl}/contact/${id}/toggle-read`, {});
  }

  deleteMessage(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/contact/${id}`);
  }

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard/stats`);
  }

   getProjectTagStats(): Observable<ChartData> {
    return this.http.get<ChartData>(`${this.apiUrl}/dashboard/tag-stats`);
  }

  getTopSkill(): Observable<TopSkill> {
    return this.http.get<TopSkill>(`${this.apiUrl}/dashboard/top-skill`);
  }

  getApprovalRate(): Observable<ApprovalRate> {
    return this.http.get<ApprovalRate>(`${this.apiUrl}/dashboard/approval-rate`);
  }
}