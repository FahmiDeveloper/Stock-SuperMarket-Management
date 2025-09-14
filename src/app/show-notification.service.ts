import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShowNotificationService {

  constructor() { }

  // Show push notification
  showNotification(title: string, body: string) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: body,
        icon: 'assets/reminder.png'
      });
    }
  }
}