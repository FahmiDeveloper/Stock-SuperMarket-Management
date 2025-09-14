import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { Subscription } from 'rxjs';

import { NotificationService } from 'src/app/shared/services/notification.service';

import { Notification } from 'src/app/shared/models/notification.model';

@Component({
  selector: 'notifications-for-desktop',
  templateUrl: './notifications-for-desktop.component.html',
  styleUrls: ['./notifications-for-desktop.scss']
})

export class NotificationsForDesktopComponent implements OnInit, OnDestroy {

  notificationsList: Notification[] = [];
  allNotifications: Notification[]= [];
  notificationsListCopieForNewNotification: Notification[] = []

  p: number = 1;
  showNotDone: boolean;
  content = '';

  subscriptionForGetAllNotifications: Subscription;
  
  constructor(
    public notificationService: NotificationService, 
    public dialogService: MatDialog
  ) {}

  ngOnInit() {
    this.getAllNotifications();
  }

  getAllNotifications() {
    this.subscriptionForGetAllNotifications = this.notificationService
    .getAll()
    .subscribe((notifications: Notification[]) => {

      this.allNotifications = notifications;

      this.notificationsListCopieForNewNotification = notifications.sort((n1, n2) => n2.reference - n1.reference);

      if (this.content) {
        this.notificationsList = notifications.filter(notification => notification.subject.toLowerCase().includes(this.content.toLowerCase()));
        this.notificationsList = this.notificationsList.sort((n1, n2) =>  new Date(n2.formatDate).getTime() - new Date(n1.formatDate).getTime());
      }

      else if (this.showNotDone) {
        this.notificationsList = notifications.filter(notification => notification.notifSubjectDone == false).sort((n1, n2) => new Date(n2.formatDate).getTime() - new Date(n1.formatDate).getTime());
      }

      else {
        this.notificationsList = notifications.sort((n1, n2) => new Date(n2.formatDate).getTime() - new Date(n1.formatDate).getTime());
      }
   
      if (this.notificationsList.length > 0) {
        this.notificationsList.forEach(notification => {
          this.getDayFromDateNotification(notification);
        })
      }
    });
  }

  OnPageChange(event: PageEvent){
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  getDayFromDateNotification(notification: Notification) {
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

    const d = new Date(notification.date);
    notification.day = weekday[d.getDay()];
  }

  getTimeAgo(notificationDate: string): string {
    const now = new Date();
    const notifDate = new Date(notificationDate);
    const diffInSeconds = Math.floor((now.getTime() - notifDate.getTime()) / 1000);
  
    if (diffInSeconds < 60) {
      return `${diffInSeconds} sec ago`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)} min ago`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    } else if (diffInSeconds < 604800) {
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    } else {
      return notifDate.toLocaleDateString(); // Show full date after a week
    }
  }

  ngOnDestroy() {
    this.subscriptionForGetAllNotifications.unsubscribe();
  }

}