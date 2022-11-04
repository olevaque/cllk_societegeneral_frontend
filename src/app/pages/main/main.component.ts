import { Route } from '@/models-queries/route';
import { AuthenticationService } from '@/services/authentication.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy
{
    headerDisable: boolean = false;
    isLogIn: boolean = false;
    username: string = '';

    routeChangeSubscription: Subscription | undefined;
    
    constructor(private router: Router, private authService: AuthenticationService)
    {
    }

    ngOnInit(): void
    {
        // S'abonne au connexion / deconnexion utilisateur
        this.authService.CurrentUserSubject.subscribe(user =>
        {
            this.isLogIn = user !== null;
            this.username = user !== null ? user.email : '';
        });

        // S'abonne a la route pour détecter les changements de route
        this.routeChangeSubscription = this.router.events.subscribe((val) =>
        {
            if (val instanceof NavigationEnd)
            {
                this.headerDisable = this.router.url.includes("/" + Route.Session + "/");
            }
        });
    }
    
    ngOnDestroy(): void
    {
        this.routeChangeSubscription?.unsubscribe();
    }

    onLogoutClicked()
    {
        this.authService.logout();
        this.router.navigate([Route.Authentication]);
    }
}
