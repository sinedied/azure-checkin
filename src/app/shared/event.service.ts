import { Injectable } from '@angular/core';
import { HttpError } from './http-error';
import { Event } from './event';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  async getEvents(): Promise<Event[]> {
    return this.fetch('/api/events');
  }

  async getEvent(eventId: string, withPasses: boolean = false): Promise<Event> {
    return this.fetch(
      `/api/events/${eventId}${withPasses ? '?withPasses=1' : ''}`
    );
  }

  async createEvent() {}

  async freePass(eventId: string, userId: string) {}

  async getPass(eventId: string) {
    const url = `/api/events/${encodeURIComponent(eventId)}/pass`;
    return this.fetch(url);
  }

  private async fetch(options: RequestInfo, init?: RequestInit) {
    const response = await fetch(options, init);

    if (!response.ok) {
      throw new HttpError(response);
    }

    return await response.json();
  }
}
