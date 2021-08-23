import { Injectable } from '@angular/core';
import { UserInfo } from './user-info';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  async getUserInfo(): Promise<UserInfo | null> {
    try {
      const response = await fetch('/.auth/me');
      const payload = await response.json();
      const { clientPrincipal } = payload;
      return clientPrincipal;
    } catch (error) {
      return null;
    }
  }
}
