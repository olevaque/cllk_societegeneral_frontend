
import { Route } from '@/models-queries/route';
import { CREATE_SESSION } from '@/models-queries/session';
import { AuthenticationService } from '@/services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';

@Component({
  selector: 'app-create-session',
  templateUrl: './create-session.component.html',
  styleUrls: ['./create-session.component.scss']
})
export class CreateSessionComponent implements OnInit
{
    get form() { return this.createSessionForm.controls; }
    
    createSessionForm: UntypedFormGroup;

    submittedForm: boolean = false;
    
    constructor(private apollo: Apollo, private formBuilder : UntypedFormBuilder, private router: Router) 
    {
        this.createSessionForm = this.formBuilder.group(
        {
            name: [null, [Validators.required]],
            isVersionA: [true]
        });
    }

    ngOnInit(): void
    {
    }

    onCreateSessionSubmit()
    {
        this.submittedForm = true;

        if (this.createSessionForm.valid)
        {
            this.apollo.mutate({ mutation: CREATE_SESSION,
            variables:
            {
                name: this.createSessionForm.value.name,
                isVersionA: this.form['isVersionA'].value
            }}).subscribe((result) =>
            {
                this.router.navigate([Route.ListSession]); 
            }, (err) => {
                console.log(err);
            });
        }
    }

    selectVersion(isVersionA: boolean)
    {
        this.form['isVersionA'].setValue(isVersionA);
    }
}
