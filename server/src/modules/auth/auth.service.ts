import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthenticateUserDto } from './dtos/authenticate-user.dto';
import { User } from '../users/user.entity';
import { UserService } from '../users/users.service';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async login(body: AuthenticateUserDto): Promise<string> {
    const existingUser: User | null = await this.userService.findByEmail(
      body.email,
    );

    if (!existingUser) {
      throw new BadRequestException('Current user does not exist');
    }

    const isPasswordValid = await bcrypt.compare(
      body.password,
      existingUser.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    const token = jwt.sign(
      {
        id: existingUser.id,
        username: existingUser.username,
      },
      'jwt-secret',
    );

    return token;
  }
}
