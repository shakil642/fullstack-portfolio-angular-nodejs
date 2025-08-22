import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { AdminLayout } from './layouts/admin-layout/admin-layout'; 
import { Login } from './components/auth/login/login';
import { ForgotPassword } from './components/auth/forgot-password/forgot-password';
import { ResetPassword } from './components/auth/reset-password/reset-password';
import { BlogPost } from './components/blog-post/blog-post';
import { Dashboard } from './components/admin/dashboard/dashboard';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  // Your existing routes for the main site would go here if you had separate pages
  // For a single-page app, we just add the new admin routes.

  { path: '', component: Home, data: { animation: 'HomePage' } },
  { path: 'login', component: Login },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'reset-password/:token', component: ResetPassword },
  { path: 'blog/:slug', component: BlogPost, data: { animation: 'BlogPage' } }, 
   {
    path: 'admin',
    component: AdminLayout,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' } // Default admin route
    ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];