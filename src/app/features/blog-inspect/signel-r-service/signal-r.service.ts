import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { UserService } from '@shared/service/user-service/user.service';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  userId : string = ''
  hubConnection !:signalR.HubConnection;

  constructor(private userService: UserService) { }

  startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl('https://localhost:7035/toastr', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
    }).withAutomaticReconnect()
    .build();

    this.hubConnection
    .start()
    .then(() => {
        // this.ssSubj.next({type: "HubConnStarted"});
    })
    .catch(err => console.log('Error while starting connection: ' + err))

    this.hubConnection.on('UserConnected', () => {
      this.addUserConnectionId()
    })
    this.hubConnection.on('NewMessage', (message) => {
      console.log(message)
      // this.addUserConnectionId()
    })
}

async addUserConnectionId(){
  return this.hubConnection.invoke('AddUserConnectionId', this.userService.getUserId())
}



}
