import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard } from './guards/login.guards';
import { Route } from './models-queries/route';
import { AuthenticationComponent } from './pages/authentication/authentication.component';
import { ComingSoonComponent } from './pages/coming-soon/coming-soon.component';
import { CreateSessionComponent } from './pages/create-session/create-session.component';
import { SessionComponent } from './pages/session/session.component';
import { ListSessionComponent } from './pages/list-session/list-session.component';

const routes: Routes = [
    
    { path: '' , redirectTo: Route.ListSession, pathMatch: 'full' },
    
    { path: Route.ComingSoon, component: ComingSoonComponent },
    { path: Route.Authentication, component: AuthenticationComponent },
    { path: Route.Session + "/:id", component: SessionComponent },

    { path: Route.ListSession, component: ListSessionComponent, canActivate: [LoginGuard] },
    { path: Route.CreateSession, component: CreateSessionComponent, canActivate: [LoginGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
