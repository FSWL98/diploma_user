import { AuthService } from './authService';

export class EventsService extends AuthService {
  static async getEvents() {
    const options = {
      mode: 'cors',
      method: 'GET'
    };

    return await this.authRequest(`${process.env.BASE_API_URL}/event/user`, options);
  }

  static async getCriterias() {
    const options = {
      mode: 'cors',
      method: 'GET'
    };

    return await this.authRequest(`${process.env.BASE_API_URL}/criteria/list`, options);
  }

  static async registerOnEvent(event_id) {
    const options = {
      mode: 'cors',
      method: 'POST'
    };

    return await this.authRequest(`${process.env.BASE_API_URL}/event/register?event_id=${event_id}`, options);
  }
}