import { FIND_SESSIONS, Session, Sessions, START_SESSION } from '@/models-queries/session';
import { AuthenticationService } from '@/services/authentication.service';
import { Component, DebugElement, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';
import { Apollo } from 'apollo-angular';
import { environment } from 'environments/environment';

declare var require: any;
var FileSaver = require('file-saver');

@Component({
  selector: 'app-list-session',
  templateUrl: './list-session.component.html',
  styleUrls: ['./list-session.component.scss']
})
export class ListSessionComponent implements OnInit
{
    sessionList: Session[] = [];
    
    filterForm: UntypedFormGroup;
    filterPanelOpen: boolean = false;
    filterAscDesc: boolean = true;
    useFilter: boolean = false;

    maxSessionDate: Date = new Date();

    constructor(private apollo: Apollo, private formBuilder : UntypedFormBuilder, public authService: AuthenticationService, private snackBar: MatSnackBar, private clipboard: Clipboard)
    {
        this.filterForm = this.formBuilder.group(
        {
            startDate: [new Date(), [Validators.required]],
            endDate: [new Date(), [Validators.required]]
        });
    }

    ngOnInit(): void
    {
        this.refreshSessions();
    }

    onStartSessionClick(sessionId: number)
    {
        this.apollo.mutate<Sessions>(
        { 
            mutation: START_SESSION,
            variables:
            {
                sessionId: sessionId
            }
        }).subscribe(result =>
        {
            this.refreshSessions();
        }, (err) => {
            console.log(err);
        });
    }

    onShareSessionClick(session: Session)
    {
        this.clipboard.copy(location.origin + "/Session/" + session.uuid);
        this.snackBar.open("Votre lien a été copié dans le presse papier !", undefined, { duration: 2000 } );
    }

    refreshSessions()
    {
        let filterAttributs: any = {};
        if (this.useFilter)
        {
            const formattedStartDate = new Date(this.filterForm.value.startDate.getTime() - (this.filterForm.value.startDate.getTimezoneOffset() * 60000 )).toISOString().split("T")[0];
            const formattedEndDate = new Date(this.filterForm.value.endDate.getTime() - (this.filterForm.value.endDate.getTimezoneOffset() * 60000 )).toISOString().split("T")[0];

            filterAttributs.sessionDate_gte = formattedStartDate;
            filterAttributs.sessionDate_lte = formattedEndDate;
        }
        
        this.apollo.query<Sessions>({ query: FIND_SESSIONS, variables: { filter: filterAttributs }}).subscribe(result =>
        {
            this.sessionList = result.data.sessions;
        }, (err) => {
            console.log(err);
        });
    }

    calculateTime(startTime: string, endTime: string): any
    {
        const diffMillisec = Date.parse('1970-01-01T' + endTime + "Z") - Date.parse('1970-01-01T' + startTime + "Z");
        const minutes = Math.floor(diffMillisec / 60000);
        const seconds = Math.floor((diffMillisec % 60000) / 1000);
        const milli = Math.floor(diffMillisec % 1000);
        return [ ((minutes < 10) ? "0" + minutes : minutes) + ":" + ((seconds < 10) ? "0" + seconds : seconds) + "." + milli, diffMillisec, minutes];
    }

    onToggleFilter(): void
    {
        this.filterPanelOpen = !this.filterPanelOpen;
    }

    onClearFilter(): void
    {
        this.useFilter = false;
        this.filterPanelOpen = false;

        this.refreshSessions();
    }

    onApplyFilter(): void
    {
        this.useFilter = true;

        this.refreshSessions();
    }
    
    sortByAnim(): void
    {
        this.filterAscDesc = !this.filterAscDesc;
        this.sessionList = this.sessionList.sort((s1: Session, s2: Session) => 
        { 
            if (s1.animator === null && s2.animator !== null) return 1;
            if (s1.animator !== null && s2.animator === null) return -1;
            if (s1.animator === null && s2.animator === null) return 0;
            if (this.filterAscDesc)
            {
                if (s1.animator.username.toLowerCase() < s2.animator.username.toLowerCase()) { return -1; }
                if (s1.animator.username.toLowerCase() > s2.animator.username.toLowerCase()) { return 1; }
            }
            else
            {
                if (s1.animator.username.toLowerCase() < s2.animator.username.toLowerCase()) { return 1; }
                if (s1.animator.username.toLowerCase() > s2.animator.username.toLowerCase()) { return -1; }
            }
            return 0;
        });
    }

    sortByState(): void
    {
        this.filterAscDesc = !this.filterAscDesc;
        this.sessionList = this.sessionList.sort((s1: Session, s2: Session) => 
        { 
            if (this.filterAscDesc)
            {
                if  (s1.isGameCompleted && !s2.isGameCompleted) return -1;
                if  (!s1.isGameCompleted && s2.isGameCompleted) return 1;
                if  (s1.isGameStarted && !s2.isGameStarted) return -1;
                if  (!s1.isGameStarted && s2.isGameStarted) return 1;
                return 0;
            }
            else
            {
                if  (s1.isGameCompleted && !s2.isGameCompleted) return 1;
                if  (!s1.isGameCompleted && s2.isGameCompleted) return -1;
                if  (s1.isGameStarted && !s2.isGameStarted) return 1;
                if  (!s1.isGameStarted && s2.isGameStarted) return -1;
                return 0;
            }
        });
    }
    exportCsvData(): void
    {
        // Header
        let csv: string = "Session;Animateur;Termine;Commentaire;Note;Détails\r\n";
        this.sessionList.forEach(session =>
        {
            // Game info
            csv += (session.name ? session.name.trim() : "-") + ";";
            csv += (session.animator ? session.animator.username : "-") + ";";
            csv += (session.isGameCompleted ? "Oui" : "Non") + ";";
            csv += (session.rates.length === 0 ? "Aucun commentaire" : session.rates.length + " commentaire(s)");
            csv += "\r\n";

            // Rating info
            session.rates.forEach(rate => 
            {
                csv += ";;;;;;;" + rate.stars + "/5;" + rate.comment+ "\r\n";
            });
        });
        var blob = new Blob([csv], { type: 'text/csv' })
        FileSaver.saveAs(blob, "Waterair_" + new Date().toISOString() + ".csv");
    }
}
