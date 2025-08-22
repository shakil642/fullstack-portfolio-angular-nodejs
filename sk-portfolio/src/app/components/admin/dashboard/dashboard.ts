import { Component, OnInit, ChangeDetectorRef, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, ChartType, ChartData, BarController, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { ApiService, Project, CreateProjectDto, Skills, Blogs, Review, Message, DashboardStats, Activity, TopSkill, ApprovalRate, BusiestMonth } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Modal } from '../../shared/modal/modal';
import { EditorModule } from '@tinymce/tinymce-angular';
import { Subscription, interval } from 'rxjs';
import { AdminViewService, AdminView } from '../../../services/admin-view'
import { CountUpDirective } from '../../../directives/count-up';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Modal, BaseChartDirective, EditorModule, CountUpDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit, OnDestroy {
  groupedActivity: { [key: string]: Activity[] } = {};
  currentView: AdminView = 'overview';
  private viewSubscription!: Subscription;
  private reviewsPollingSubscription!: Subscription;
  dashboardStats: DashboardStats | null = null;
  topSkill: string | null = null;
  approvalRate: number | null = null;
  busiestMonth: string | null = null;

  projects: Project[] = [];
  projectForm: FormGroup; 
  selectedFile: File | null = null;
  
  // State management for modals
  editingProjectId: number | null = null;
  showProjectModal = false; 
  showDeleteModal = false;
  projectToDeleteId: number | null = null;

  projectApiError: string | null = null;
  projectSuccessMessage: string | null = null;
  skillApiError: string | null = null;
  skillSuccessMessage: string | null = null;
  blogApiError: string | null = null;
  blogSuccessMessage: string | null = null;

  skills: Skills = {};
  skillsForm: FormGroup;

  blogsForAdmin: Blogs[] = [];
  blogForm: FormGroup;
  editingBlogId: number | null = null;
  showBlogModal = false;
  blogToDeleteId: number | null = null;
  showBlogDeleteModal = false;

  reviewsForAdmin: Review[] = [];
  reviewToDeleteId: number | null = null;
  showReviewDeleteModal = false;
  reviewApiError: string | null = null;
  reviewSuccessMessage: string | null = null;

  messagesForAdmin: Message[] = [];
  messageToDeleteId: number | null = null;
  showMsgDeleteModal = false;
  messageApiError: string | null = null;
  messageSuccessMessage: string | null = null;

  public barChartOptions: ChartConfiguration['options'] = {
    maintainAspectRatio: false, 
    responsive: true,
    scales: { x: {}, y: { min: 0, ticks: { stepSize: 1 } } },
    plugins: { legend: { display: false } }
  };
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { 
        data: [], 
        label: 'Projects',
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
        borderRadius: 4,
        barPercentage: 0.5 
      }
    ]
  };

  constructor(
    private adminViewService: AdminViewService,
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {

    Chart.register(BarController, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
    this.setChartFontSize();

    // RENAMED form for clarity
    this.projectForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      image_url: [''],
      github_link: ['', Validators.required],
      live_link: ['', Validators.required],
      tags: ['', Validators.required],
      image_file: [null], 
      upload_option: ['url', Validators.required], 
    });

    this.skillsForm = this.fb.group({
      'Programming & Frameworks': [''],
      'Databases': [''],
      'Tools & Methods': ['']
    });

    this.blogForm = this.fb.group({
      title: ['', Validators.required],
      excerpt: ['', Validators.required],
      content: ['', Validators.required],
      image_url: ['/uploads/placeholder.png'],
      is_published: [false],
      image_file: [null], 
      upload_option: ['url', Validators.required]
    });
  }

  @HostListener('window:resize')
  onResize() {
    this.setChartFontSize();
  }

  // 3. New method to set font size based on screen width
private setChartFontSize() {
    const isMobile = window.innerWidth < 768;
    const fontSize = isMobile ? 10 : 12;

    // Ensure the scales and x-axis options exist
    if (this.barChartOptions && this.barChartOptions.scales && this.barChartOptions.scales['x']) {
      if (!this.barChartOptions.scales['x'].ticks) {
        this.barChartOptions.scales['x'].ticks = {};
      }
      if (!this.barChartOptions.scales['x'].ticks.font) {
        this.barChartOptions.scales['x'].ticks.font = {};
      }
      (this.barChartOptions.scales['x'].ticks.font as any).size = fontSize;
    }
  }

  ngOnInit(): void {
    this.loadRecentActivity();
    this.loadProjects();
    this.loadSkills();
    this.loadAdminBlogs();
    this.loadAdminReviews();
    this.loadAdminMessages();
    this.loadDashboardStats();
    this.loadTagStats();
    this.loadTopSkill();
    this.loadApprovalRate();
    this.loadBusiestMonth();

    this.viewSubscription = this.adminViewService.currentView$.subscribe(view => {
      this.currentView = view;
      this.cdr.markForCheck(); 
    });

    this.reviewsPollingSubscription = interval(15000).subscribe(() => {
      console.log('Polling for new reviews...');
      this.loadAdminReviews();
    });
  }

  ngOnDestroy(): void {
    if (this.viewSubscription) {
      this.viewSubscription.unsubscribe();
    }
    if (this.reviewsPollingSubscription) {
      this.reviewsPollingSubscription.unsubscribe();
    }
  }

  // --- NEW METHOD TO LOAD ACTIVITY FEED ---
  loadRecentActivity(): void {
    this.apiService.getRecentActivity().subscribe(activity => {
      this.groupedActivity = activity.reduce((acc, item) => {
        const typeKey = `${item.type}s`;
        if (!acc[typeKey]) {
          acc[typeKey] = [];
        }
        acc[typeKey].push(item);
        return acc;
      }, {} as { [key: string]: Activity[] });

      this.cdr.markForCheck();
    });
  }

  // Helper function to get the keys for the template
  getActivityKeys(): string[] {
    return Object.keys(this.groupedActivity);
  }

  // --- NEW: Method to change the active view ---
  changeView(view: AdminView): void { 
    this.currentView = view;
  }

  loadTopSkill(): void {
    this.apiService.getTopSkill().subscribe(data => {
      this.topSkill = data.topSkill;
      this.cdr.markForCheck();
    });
  }

  loadApprovalRate(): void {
    this.apiService.getApprovalRate().subscribe(data => {
      this.approvalRate = data.approvalRate;
      this.cdr.markForCheck();
    });
  }

  loadBusiestMonth(): void {
    this.apiService.getBusiestMonth().subscribe(data => {
      this.busiestMonth = data.busiestMonth;
      this.cdr.markForCheck();
    });
  }

  loadTagStats(): void {
    this.apiService.getProjectTagStats().subscribe(stats => {
      const generateColors = (numColors: number) => {
        const colors = [];
        const baseColors = [
          'rgba(54, 162, 235, 0.8)', // Blue
          'rgba(75, 192, 192, 0.8)', // Green
          'rgba(255, 206, 86, 0.8)', // Yellow
          'rgba(255, 99, 132, 0.8)', // Red
          'rgba(153, 102, 255, 0.8)' // Purple
        ];
        for (let i = 0; i < numColors; i++) {
          colors.push(baseColors[i % baseColors.length]);
        }
        return colors;
      };

      const backgroundColors = generateColors(stats.data.length);

      this.barChartData = {
        labels: stats.labels,
        datasets: [{ 
          ...this.barChartData.datasets[0], 
          data: stats.data,
          backgroundColor: backgroundColors, 
          borderColor: backgroundColors.map(c => c.replace('0.6', '1')) 
        }]
      };
      this.cdr.markForCheck();
    });
  }

  loadDashboardStats(): void {
    this.apiService.getDashboardStats().subscribe(stats => {
      this.dashboardStats = stats;
      this.cdr.markForCheck();
    });
  }

  loadProjects(): void {
    this.apiService.getProjects().subscribe(data => {
      this.projects = data;
      this.cdr.markForCheck();
    });
  }

  loadSkills(): void {
    this.apiService.getSkills().subscribe(data => {
      this.skills = data;
      // Populate the form with skills, joined by a newline for the textarea
      this.skillsForm.patchValue({
        'Programming & Frameworks': (this.skills['Programming & Frameworks'] || []).join('\n'),
        'Databases': (this.skills['Databases'] || []).join('\n'),
        'Tools & Methods': (this.skills['Tools & Methods'] || []).join('\n')
      });
    });
  }

  showFlashMessage(type: 'projectSuccess' | 'projectError' | 'skillSuccess' | 'skillError' | 'blogSuccess' | 'blogError' | 'reviewSuccess' | 'reviewError' | 'messageSuccess' | 'messageError', message: string): void {
    this.clearMessages();
    if (type === 'projectSuccess') this.projectSuccessMessage = message;
    if (type === 'projectError') this.projectApiError = message;
    if (type === 'skillSuccess') this.skillSuccessMessage = message;
    if (type === 'skillError') this.skillApiError = message;
    if (type === 'blogError') this.blogSuccessMessage = message;
    if (type === 'blogSuccess') this.blogApiError = message;
    if (type === 'reviewSuccess') this.reviewSuccessMessage = message;
    if (type === 'reviewError') this.reviewApiError = message;
    if (type === 'messageSuccess') this.messageSuccessMessage = message;
    if (type === 'messageError') this.messageApiError = message;
    
    setTimeout(() => this.clearMessages(), 2000); 
  }
  
  clearMessages(): void {
    this.projectApiError = null;
    this.projectSuccessMessage = null;
    this.skillApiError = null;
    this.skillSuccessMessage = null;
    this.blogApiError = null;
    this.blogSuccessMessage = null;
    this.reviewApiError = null;
    this.reviewSuccessMessage = null;
    this.messageApiError = null;
    this.messageSuccessMessage = null;
    this.cdr.markForCheck(); 
  }
  onSkillsSubmit(): void {
    const formValues = this.skillsForm.value;
    const skillsToSave: {name: string, category: string}[] = [];

    // Convert the textarea strings back into the array format the API expects
    for (const category in formValues) {
      const skillsArray = formValues[category].split('\n').filter((s: string) => s.trim() !== '');
      for (const name of skillsArray) {
        skillsToSave.push({ name: name.trim(), category });
      }
    }

    this.apiService.updateSkills(skillsToSave).subscribe({
      next: () => {
        this.showFlashMessage('skillSuccess', 'Skills updated successfully!');
        this.loadSkills();
        this.cdr.markForCheck(); 
      },
      error: () => {
        this.showFlashMessage('skillError', 'Failed to update skills.');
      }
    });
  }
  
  //Blog section
  loadAdminBlogs(): void {
    this.apiService.getAllBlogsForAdmin().subscribe(data => {
      this.blogsForAdmin = data;
      this.cdr.markForCheck();
    });
  }

  openAddBlogModal(): void {
    this.editingBlogId = null;
    this.blogForm.reset({ is_published: false, upload_option: 'url' });
    this.selectedFile = null;
    this.showBlogModal = true;
  }

  openEditBlogModal(blog: Blogs): void {
    this.editingBlogId = blog.id;
    this.blogForm.patchValue(blog);
    this.blogForm.patchValue({ upload_option: 'url' });
    this.selectedFile = null;
    this.showBlogModal = true;
  }
  
  closeBlogModal(): void {
    this.showBlogModal = false;
    this.selectedFile = null;
  }

  onBlogFormSubmit(): void {
    this.blogForm.markAllAsTouched();
    if (this.blogForm.invalid) return;

    if (this.blogForm.value.upload_option === 'upload' && this.selectedFile) {
      this.apiService.uploadImage(this.selectedFile).subscribe({
        next: (uploadRes) => {
          const blogData = { ...this.blogForm.value, image_url: uploadRes.filePath };
          this.submitBlogData(blogData);
        },
        error: (err) => { this.showFlashMessage('blogError', 'Image upload failed.'); }
      });
    } else {
      this.submitBlogData(this.blogForm.value);
    }
  }

  submitBlogData(blogData: Partial<Blogs>): void {
    const apiCall = this.editingBlogId
      ? this.apiService.updateBlog(this.editingBlogId, blogData)
      : this.apiService.createBlog(blogData);

    apiCall.subscribe({
      next: () => {
        this.showFlashMessage('blogSuccess', `Blog post ${this.editingBlogId ? 'updated' : 'created'}!`);
        this.loadAdminBlogs();
        this.closeBlogModal();
      },
      error: (err) => { this.showFlashMessage('blogError', 'Failed to save blog post.'); }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      this.selectedFile = fileList[0];
      this.projectForm.patchValue({ image_url: '' });
    }
  }

  // --- NEW MODAL CONTROL FUNCTIONS ---
  openAddProjectModal(): void {
    this.editingProjectId = null;
    this.projectForm.reset({ upload_option: 'url' });
    this.showProjectModal = true;
  }

  openEditProjectModal(project: Project): void {
    this.editingProjectId = project.id;
    this.projectForm.patchValue(project);
    this.projectForm.patchValue({ upload_option: 'url' });
    this.showProjectModal = true;
  }

  closeProjectModal(): void {
    this.showProjectModal = false;
    this.projectApiError = null;
    this.selectedFile = null;
  }
  
  // --- NEW UNIFIED FORM SUBMISSION LOGIC ---
  onProjectFormSubmit(): void {
    this.projectForm.markAllAsTouched();
    if (this.projectForm.invalid) return;
    this.projectApiError = null;

    if (this.projectForm.value.upload_option === 'upload' && this.selectedFile) {
      this.apiService.uploadImage(this.selectedFile).subscribe({
        next: (uploadRes) => {
          const projectData = { ...this.projectForm.value, image_url: uploadRes.filePath };
          this.submitProjectData(projectData);
        },
        error: (err) => {
          this.projectApiError = 'Image upload failed. Please try again.';
          console.error('Image upload failed:', err);
        }
      });
    } else {
      this.submitProjectData(this.projectForm.value);
    }
  }

  // Helper function to either create or update a project
  submitProjectData(projectData: CreateProjectDto): void {
    const apiCall = this.editingProjectId
      ? this.apiService.updateProject(this.editingProjectId, projectData)
      : this.apiService.createProject(projectData);

    apiCall.subscribe({
      next: () => {
        this.showFlashMessage('projectSuccess', `Project ${this.editingProjectId ? 'updated' : 'created'} successfully!`);
        this.loadProjects();
        this.closeProjectModal();
      },
      error: () => {
        this.showFlashMessage('projectError', `Failed to ${this.editingProjectId ? 'update' : 'create'} project.`);
      }
    });
  }

  // Delete project logic
  promptDeleteProject(projectId: number): void {
    this.projectToDeleteId = projectId;
    this.showDeleteModal = true;
  }

  handleDeleteConfirmation(isConfirmed: boolean): void {
    this.showDeleteModal = false;
    // this.apiError = null;

    if (isConfirmed && this.projectToDeleteId) {
      this.apiService.deleteProject(this.projectToDeleteId).subscribe({
        next: () => {
          this.showFlashMessage('projectSuccess', 'Project deleted successfully!');
          this.loadProjects();
        },
        error: () => {
          this.showFlashMessage('projectError', 'Error: Could not delete the project.');
        }
      });
    }
    this.projectToDeleteId = null;
  }
  
  //blog delete
  promptDeleteBlog(blogId: number): void {
    this.blogToDeleteId = blogId;
    this.showBlogDeleteModal = true;
  }

  handleBlogDeleteConfirmation(isConfirmed: boolean): void {
    this.showBlogDeleteModal = false;
    if (isConfirmed && this.blogToDeleteId) {
      this.apiService.deleteBlog(this.blogToDeleteId).subscribe({
        next: () => {
          this.showFlashMessage('blogSuccess', 'Blog post deleted successfully!');
          this.loadAdminBlogs();
        },
        error: (err) => { this.showFlashMessage('blogError', 'Failed to delete blog post.'); }
      });
    }
  }

  loadAdminReviews(): void {
    this.apiService.getAllReviewsForAdmin().subscribe(data => {
      this.reviewsForAdmin = data;
      this.cdr.markForCheck();
    });
  }

  approveReview(reviewId: number): void {
    this.apiService.approveReview(reviewId).subscribe({
      next: () => {
        this.showFlashMessage('reviewSuccess', 'Review approved successfully!');
        this.loadAdminReviews();
      },
      error: (err) => { this.showFlashMessage('reviewError', 'Failed to approve review.'); }
    });
  }

  promptDeleteReview(reviewId: number): void {
    this.reviewToDeleteId = reviewId;
    this.showReviewDeleteModal = true;
  }

  handleReviewDeleteConfirmation(isConfirmed: boolean): void {
    this.showReviewDeleteModal = false;
    if (isConfirmed && this.reviewToDeleteId) {
      this.apiService.deleteReview(this.reviewToDeleteId).subscribe({
        next: () => {
          this.showFlashMessage('reviewSuccess', 'Review deleted successfully!');
          this.loadAdminReviews();
        },
        error: (err) => { this.showFlashMessage('reviewError', 'Failed to delete review.'); }
      });
    }
    this.reviewToDeleteId = null;
  }

  loadAdminMessages(): void {
    this.apiService.getAllMessages().subscribe(data => {
      this.messagesForAdmin = data;
      this.cdr.markForCheck();
    });
  }

  toggleMessageRead(messageId: number): void {
    this.apiService.toggleMessageRead(messageId).subscribe({
      next: () => {
        this.showFlashMessage('messageSuccess', 'Message status updated!');
        this.loadAdminMessages();
      },
      error: (err) => { this.showFlashMessage('messageError', 'Failed to update message.'); }
    });
  }

  promptDeleteMessage(messageId: number): void {
    this.messageToDeleteId = messageId;
    this.showMsgDeleteModal = true;
  }

  handleMessageDeleteConfirmation(isConfirmed: boolean): void {
    this.showMsgDeleteModal = false;
    if (isConfirmed && this.messageToDeleteId) {
      this.apiService.deleteMessage(this.messageToDeleteId).subscribe({
        next: () => {
          this.showFlashMessage('messageSuccess', 'Message deleted successfully!');
          this.loadAdminMessages();
        },
        error: (err) => { this.showFlashMessage('messageError', 'Failed to delete message.'); }
      });
    }
  }

  openEmail(email: string, event: MouseEvent) {
    event.preventDefault();

    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isMobile = /Mobi|Android/i.test(ua);
    const isiOS = /iPhone|iPad|iPod/i.test(ua);

    // Desktop: open Gmail web compose in a new tab so it uses the logged-in Gmail account.
    if (!isMobile) {
      const gmailWeb = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;
      window.open(gmailWeb, '_blank');
      return;
    }

    if (isiOS) {
      const gmailAppUrl = `googlegmail://co?to=${encodeURIComponent(email)}`;
      const fallback = `mailto:${email}`;

      // Try app, then fallback after short delay if not installed
      window.location.href = gmailAppUrl;
      setTimeout(() => { window.location.href = fallback; }, 600);
      return;
    }

    // Android / other mobile
    const intentUrl = `intent://compose?to=${encodeURIComponent(email)}#Intent;scheme=mailto;package=com.google.android.gm;end`;
    const fallback = `mailto:${email}`;

    // Try intent (opens Gmail app on Android Chrome), fallback to mailto if it fails
    window.location.href = intentUrl;
    setTimeout(() => { window.location.href = fallback; }, 600);
  }
}

