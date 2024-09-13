import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  //   declare here endpoints you want to guard with auth guard
  // @UseGuards(AuthGuard)
  // @Get('profile')
  // getProfile(Request() req) {
  //     return requestAnimationFrame.user;
  // }
}
