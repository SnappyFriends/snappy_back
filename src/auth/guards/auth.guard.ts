import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { userType } from 'src/users/entities/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtServices: JwtService) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.headers.authorization?.split(" ")[1]

    if (!token) throw new UnauthorizedException("Token no encontrado.");

    try {
      const secret = process.env.JWT_SECRET;
      const user = this.jwtServices.verify(token, { secret });

      user.exp = new Date(user.exp * 1000);
      user.iat = new Date(user.iat * 1000);

      if (user.isAdmin) {
        user.roles = [userType.ADMIN]
      } else {
        user.roles = [userType.REGULAR];
      }
      request.user = user;

      return true;
    } catch { throw new UnauthorizedException("Token invalido."); }
  }
}
