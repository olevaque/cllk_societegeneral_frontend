import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '@/services/authentication.service';

import { Route } from '@/models-queries/route';

@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate
{
    constructor(private router: Router,  private authenticationService: AuthenticationService)
    {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    {
        const currentUser = this.authenticationService.CurrentUserValue;
        if (currentUser)
        {
            // Utilisateur loggé, autorise l'accès
            return true;
        }
        else
        {
            // Utilisateur non loggé, retourne à la page de log
            this.router.navigate([Route.Authentication]);
            return false;
        }
    }
}