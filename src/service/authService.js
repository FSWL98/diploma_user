import BaseService from './baseService';

export class AuthService extends BaseService {
  static isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  static getAuthToken() {
    return localStorage.getItem('token');
  }

  static async authorize(user, password) {
    const data = {
      'email': user,
      password
    }
    const options = {
      mode: 'cors',
      method: 'POST',
      body: JSON.stringify(data)
    };
    return await this.request(`${process.env.BASE_API_URL}/auth/user/login`, options);
  }

  static logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  static async authRequest(url, options, type = true) {
    options.headers = {
      Authorization: `bearer ${this.getAuthToken()}`,
      'Content-Type': 'application/json',
    };
    options.mode = 'cors';
    const response = await fetch(url, options);
    return this.parseResponse(response, true);
  }
}