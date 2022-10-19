import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { GraphQLModule } from './graphql.module';
import { MainComponent } from './pages/main/main.component';
import { AuthenticationComponent } from './pages/authentication/authentication.component';
import { HeaderComponent } from './components/header/header.component';
import { ListSessionComponent } from './pages/list-session/list-session.component';
import { CreateSessionComponent } from './pages/create-session/create-session.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ModalComponent } from './components/modal/modal.component';
import { ComingSoonComponent } from './pages/coming-soon/coming-soon.component';
import { SessionComponent } from './pages/session/session.component';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { ApolloModule } from 'apollo-angular';

@NgModule({
    declarations: [
        MainComponent,
        AuthenticationComponent,
        HeaderComponent,
        ListSessionComponent,
        CreateSessionComponent,
        ModalComponent,
        ComingSoonComponent,

        SessionComponent,
    ],
    imports: [
        BrowserModule,
        CommonModule,
        AppRoutingModule,
        ReactiveFormsModule,
        
        HttpClientModule,
        ApolloModule,
        GraphQLModule,

        MatDialogModule,
        MatSnackBarModule,

        NoopAnimationsModule
    ],
    providers: [],
    bootstrap: [MainComponent]
})
export class AppModule { }
