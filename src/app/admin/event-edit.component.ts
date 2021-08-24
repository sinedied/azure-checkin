import { Component, OnInit } from '@angular/core';
import { Event } from '../shared/event';

@Component({
  selector: 'app-event-edit',
  template: ` <p>event-edit works!</p> `,
  styles: [],
})
export class EventEditComponent implements OnInit {
  id: string | null = null;
  currentEvent: Event | null = null;

  constructor() {}

  ngOnInit(): void {}
}
