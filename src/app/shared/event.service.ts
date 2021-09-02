import { Injectable } from '@angular/core';
import { HttpError } from './http-error';
import { Event } from './event';

export interface NewEvent {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  passes: string[];
}

export interface EventPatch {
  name?: string;
  startDate?: string;
  endDate?: string;
  passes?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class EventService {
  async getEvents(showArchived: boolean = false): Promise<Event[]> {
    return this.fetch(`/api/events${showArchived ? '?showArchived=1' : ''}`);
  }

  async getEvent(eventId: string, withPasses: boolean = false): Promise<Event> {
    return this.fetch(`/api/events/${eventId}${withPasses ? '?withPasses=1' : ''}`);
  }

  async createEvent(event: NewEvent): Promise<Event> {
    return this.fetch('/api/events', {
      method: 'POST',
      body: JSON.stringify(event),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async archiveEvent(eventId: string): Promise<void> {
    return this.fetch(`/api/events/${eventId}`, {
      method: 'PATCH',
      body: JSON.stringify({ archived: true }),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async setEventLock(eventId: string, locked: boolean): Promise<void> {
    return this.fetch(`/api/events/${eventId}`, {
      method: 'PATCH',
      body: JSON.stringify({ locked }),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async patchEvent(eventId: string, event: EventPatch): Promise<Event> {
    return this.fetch(`/api/events/${eventId}`, {
      method: 'PATCH',
      body: JSON.stringify(event),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async assignPass(eventId: string, pass: string, assign: boolean = false) {
    return this.fetch(`/api/events/${eventId}/passes/${pass}`, {
      method: 'PUT',
      body: JSON.stringify({ assign }),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async getPass(eventId: string) {
    const url = `/api/events/${encodeURIComponent(eventId)}/pass`;
    return this.fetch(url);
  }

  private async fetch(options: RequestInfo, init?: RequestInit): Promise<any> {
    const response = await fetch(options, init);

    if (!response.ok) {
      let message = undefined;
      try {
        message = await response.text();
      } catch {}
      throw new HttpError(response, message);
    }

    let result = null;
    try {
      result = await response.json();
    } catch {}

    return result;
  }
}
