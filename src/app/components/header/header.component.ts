import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent
{
    @Input() userConnected: boolean = false;
    @Input() useFullscreenBtn: boolean = false;
    
    @Input() username: string = '';
    @Output() onLogoutClicked = new EventEmitter();
    @Output() onFullscreenClicked = new EventEmitter();

    onLogOutClick()
    {
        this.onLogoutClicked.emit();
    }
    
    onFullscreenClick()
    {
        this.onFullscreenClicked.emit();
    }
}
