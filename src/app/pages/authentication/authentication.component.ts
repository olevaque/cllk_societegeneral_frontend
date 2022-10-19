import { Route } from '@/models-queries/route';
import { User } from '@/models-queries/user';
import { AuthenticationService } from '@/services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit
{
    public connexionError: boolean = false;
    public user: User | null = null;
    public isAdmin: boolean = false;
    public isLoading: boolean = false;

    constructor(private authService: AuthenticationService, private router: Router)
    {
        this.authService.CurrentUserSubject.subscribe(user =>
        {
            this.user = user;
            this.isAdmin = this.authService.CurrentUserIsAdmin;
        });
    }

    ngOnInit(): void
    {
        if (this.authService.CurrentUserValue)
        {
            this.router.navigate([Route.ListSession]); 
        }
    }

    onAuthenticationSubmit(username : string, password : string)
    {
        this.connexionError = false;
        this.isLoading = true;

        this.authService.login(username, password).pipe(first()).subscribe(
            data => {
                this.isLoading = false;
                this.router.navigate([Route.ListSession]); 
            },
            error => {
                this.isLoading = false;
                this.connexionError = true;
            }
        );
    }
}
