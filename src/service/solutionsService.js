import { AuthService } from './authService';

export class SolutionsService extends AuthService {
  static async getSolution(solutionId) {
    const options = {
      mode: 'cors',
      method: 'GET'
    };

    return await this.authRequest(`${process.env.BASE_API_URL}/solution?solution_id=${solutionId}`, options);
  };

  static async createSolution(body) {
    const options = {
      mode: 'cors',
      method: 'POST',
      body: JSON.stringify(body)
    };

    return await this.authRequest(`${process.env.BASE_API_URL}/solution`, options);
  }

}