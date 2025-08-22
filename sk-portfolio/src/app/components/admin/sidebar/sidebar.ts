import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { AdminView, AdminViewService } from '../../../services/admin-view';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar implements OnInit{
  @Output() menuItemClick = new EventEmitter<void>();
  activeView = 'overview';
  
  userName: string | null = null;
  userEmail: string | null = null;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private adminViewService: AdminViewService
  ) {}

  ngOnInit(): void {
    // 3. Decode the token to get user info
    const token = this.authService.getToken();
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        this.userName = "Shakil Ahmed"; // You can set your name directly
        this.userEmail = decodedToken.email; // 'username' from our JWT payload is the email
      } catch(error) {
        console.error("Error decoding token", error);
      }
    }
    this.adminViewService.currentView$.subscribe(view => {
      this.activeView = view;
    });
  }

  changeView(view: AdminView): void {
    this.activeView = view;
    this.adminViewService.changeView(view);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}