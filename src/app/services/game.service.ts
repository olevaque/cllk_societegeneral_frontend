
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GameService
{
    constructor(private socket: Socket)
    {

    }

    public sendMessage(message: string)
    {
        this.socket.emit("")
    }
}