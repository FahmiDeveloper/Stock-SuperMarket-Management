import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { mergeMap, mergeMapTo } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  private messageSource = new BehaviorSubject(null);
  currentMessage = this.messageSource.asObservable();

  constructor(private afMessaging: AngularFireMessaging) {
    this.afMessaging.messages.subscribe(
      (_messaging: AngularFireMessaging) => {
      _messaging.onMessage = _messaging.onMessage.bind(_messaging);
      _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
    }) 
  }

  requestPermission(): Observable<string | null> {
    return this.afMessaging.requestToken.pipe(
      mergeMap((token: string | null) => {
        if (token) {
          console.log('Permission granted! Token: ', token);
          return new Observable<string>((observer) => {
            observer.next(token);
            observer.complete();
          });
        } else {
          return new Observable<string>((observer) => {
            observer.error('No token received');
            observer.complete();
          });
        }
      })
    );
  }

  receiveMessage() {
    this.afMessaging.messages.subscribe((payload: any) => {
      console.log('Message received: ', payload);
  
      const notificationTitle = payload.notification.title;
      const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon
      };
  
      if (Notification.permission === 'granted') {
        new Notification(notificationTitle, notificationOptions);
      }
    });
  }
  
}
