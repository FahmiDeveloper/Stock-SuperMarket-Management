import { Routes } from '@angular/router';
import { HomeComponent } from './core/components/home/home.component';
import { LoginComponent } from './core/components/login/login.component';
import { RegisterComponent } from './core/components/register/register.component';
import { AuthGuard } from './shared/services/auth.guard';
import { SharedResolver } from './shared/services/shared.resolver';
import { UserComponent } from './user/user.component';


export const rootRouterConfig: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },
  
  { path: 'user', component: UserComponent,  resolve: { data: SharedResolver}},
  { path: 'home', component: HomeComponent,  resolve: { data: SharedResolver}}
]; 