import { Controller, Post, Body } from '@nestjs/common';
import { AuthenticateUserDto } from './dtos/authenticate-user.dto';
import { AuthService } from './auth.service';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login(@Body() authUser: AuthenticateUserDto): Promise<string> {
    return this.authService.login(authUser);
  }
}
