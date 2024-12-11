import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  create(userData) {
    return userData;
  }
}
