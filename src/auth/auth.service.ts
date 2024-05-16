import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './../user/user.service';
import { AuthUser } from './dto/auth-user.dto';
import { compare } from 'bcrypt';
import { HttpResponses, ResponseServerError } from 'src/utils/http-responses';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async login(dto: AuthUser) {
    try {
      // cek email user apakah terdaftar di sistem atau tidak
      const user = await this.userService.findByEmail(dto.email);
      // jika user terdaftar dan password sesuai dengan yang ada di db
      if (user && (await compare(dto.password, user.password))) {
        const { password, ...result } = user;
        // det adalah id dari user, kepanjangan dari detail dan biar unik
        const payload = { det: result.id, email: result.email };
        return {
          ...result,
          access_token: await this.jwtService.signAsync(payload, {
            secret: process.env.SECRET_KEY_JWT,
            expiresIn: '1d',
          }),
        };
      }

      HttpResponses(
        'Periksa kembali email atau password',
        HttpStatus.UNAUTHORIZED,
      );
    } catch (error: any) {
      ResponseServerError();
    }
  }
}
