import { Injectable } from '@angular/core';
import { UserInfo } from './user-info';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  async getUserInfo(): Promise<UserInfo | null> {
    try {
      const response = await fetch('/api/users/me');
      return await response.json();
    } catch (error) {
      return null;
    }
  }
}
