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
      console.log('user', user);
      console.log('pass ', dto.password);
      // jika user terdaftar dan password sesuai dengan yang ada di db
      if (user && (await compare(dto.password, user.password))) {
        console.log('user 22', user);
        const { password, ...result } = user;
        const payload = { det: result.id, email: result.email };
        return {
          ...result,
          access_token: await this.jwtService.signAsync(payload, {
            secret: 'qwerty12345',
            expiresIn: '5s',
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
