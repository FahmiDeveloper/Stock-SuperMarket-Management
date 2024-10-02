import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private fcmUrl = 'https://fcm.googleapis.com/fcm/send';
  private serverKey = 'AAAAeJ1aQy0:APA91bF4Mopiqz9t0ZUbiQpFFw1hwW43AeNDk1RlNKebux8pBPp9Fx8Tq6OUUQxmDQgOpeMlFA3HHtmNEV2lIAEna3cA49e1LE-wwFvQKsSi0i3TOjw1NgPI1sXlKd1W2o_Otq7P3IYs'; // Remplacez par votre clé serveur de Firebase

  constructor(private http: HttpClient) {}

  sendNotification(token: string, title: string, body: string) {
    const payload = {
      to: token,
      notification: {
        title: title,
        body: body,
        click_action: 'http://localhost:4200/expirations-for-desktop',
        icon: 'https://i.ibb.co/16Sktn1/angular.png' // Icône personnalisée
      },
    };

    return this.http.post(this.fcmUrl, payload, {
      headers: {
        Authorization: `key=${this.serverKey}`,
        'Content-Type': 'application/json'
      }
    });
  }
}
