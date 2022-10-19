import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

declare var window: any;

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss']
})
export class SessionComponent implements OnInit
{
    public isLoading: boolean = true;
    public loadProgress: number = 0;

    private gameInstance: any;
    private uuidSession: string;

    constructor(private route: ActivatedRoute)
    {
        this.uuidSession = this.route.snapshot.params['id'];
    }

    ngOnInit(): void
    {
        this.gameInstance = window['UnityLoader'].instantiate("unityContainer", "../../../assets/unity/game/Build/game.json",
        { 
            onProgress: (unityInstance: any, progress: number) =>
            {
                if (!unityInstance.Module) return;
                
                this.isLoading = progress >= 0.9 ? false : true;
                this.loadProgress = Math.round(progress * 100);
            },
            onsuccess: (unityInstance: any) =>
            {
                unityInstance.SendMessage("_Script", "OnSendMessageReceived", this.uuidSession);
            }
        });
    }

    setFullscreen(): void
    {
        this.gameInstance.SetFullscreen(1);
    }
}
