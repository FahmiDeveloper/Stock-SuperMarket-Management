import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stock-menu',
  templateUrl: './stock-menu.component.html',
  styleUrls: ['./stock-menu.component.scss']
})
export class StockMenuComponent implements OnInit {

  event: any;

  constructor() { }

  ngOnInit(): void {
    this.loadEvent();
  }

  loadEvent() {
    this.event = {
        id: 1,
        name: 'Angular Connect',
        date: new Date('9/26/2036'),
        time: '10:00 am',
        price: 599.99,
        imageUrl: '/assets/images/angularconnect-shield.png',
        location: {
          address: '1057 DT',
          city: 'London',
          country: 'England'
        }   
    }
  }
}
