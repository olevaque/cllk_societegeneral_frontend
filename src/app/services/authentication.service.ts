
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { User } from '@/models-queries/user';

import { environment } from 'environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthenticationService
{
    // Accessors
    public get CurrentUserSubject(): BehaviorSubject<User | null>
    {
        return this.currentUserSubject;
    }
    public get CurrentUserValue(): User | null
    {
        return this.currentUserSubject.value;
    }
    public get CurrentUserIsAdmin(): boolean
    {
        return this.CurrentUserSubject.value?.role.name === "Administrateur";
    }

    private currentUserSubject: BehaviorSubject<User | null>;

    constructor(private http: HttpClient)
    {
        let lStorage = localStorage.getItem(environment.LOCAL_STORAGE_CURRENT_USER);
        if (lStorage != null)
        {
            this.currentUserSubject = new BehaviorSubject<User | null>(JSON.parse(lStorage));
        }
        else
        {
            this.currentUserSubject = new BehaviorSubject<User | null>(null);
        }
    }

    public login(username: string, password: string)
    {
        return this.http.post<any>(environment.authenticationUrl, { "identifier": username, "password": password }).pipe(map(response =>
        {
            // Token reçu
            if (response && response.jwt)
            {
                let userResponse : User = response.user;

                localStorage.setItem(environment.LOCAL_STORAGE_CURRENT_USER, JSON.stringify(userResponse));
                localStorage.setItem(environment.LOCAL_STORAGE_TOKEN, response.jwt);

                this.currentUserSubject.next(userResponse);
            }
        }));
    }

    public logout()
    {
        localStorage.removeItem(environment.LOCAL_STORAGE_CURRENT_USER);
        localStorage.removeItem(environment.LOCAL_STORAGE_TOKEN);
        
        this.currentUserSubject.next(null);
    }
}