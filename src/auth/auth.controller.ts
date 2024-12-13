import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDTO, registerUserDTO } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  signUp(@Body() userData: registerUserDTO) {
    return this.authService.signUp(userData);
  }

  @HttpCode(200)
  @Post('signin')
  signIn(@Body() loginData: LoginUserDTO) {
    return this.authService.signIn(loginData.email, loginData.password);
  }
}
