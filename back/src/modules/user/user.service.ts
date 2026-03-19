import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getUser() {
    return { id: 1, name: 'Admin' };
  }
}