import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './../user/user.service';
import { AuthUser } from './dto/auth-user.dto';
import { compare, hash } from 'bcrypt';
import { HttpResponses, ResponseServerError } from 'src/utils/http-responses';
import { PrismaService } from './../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private prismaService: PrismaService,
  ) {}

  async findByEmail(email: string) {
    try {
      const response = await this.prismaService.user.findUnique({
        where: {
          email,
        },
      });

      return response;
    } catch (error: any) {
      ResponseServerError();
    }
  }

  async register(createUserDto: CreateUserDto) {
    try {
      // check email agar tidak duplikat
      const checkMail = await this.findByEmail(createUserDto.email);

      if (checkMail) {
        HttpResponses('Email telah digunakan', HttpStatus.CONFLICT);
      }

      const response = await this.prismaService.user.create({
        data: {
          ...createUserDto,
          password: await hash(createUserDto.password, 10),
        },
      });

      if (!response) {
        // Tangani kesalahan yang mungkin terjadi
        HttpResponses(
          'Gagal mendaftarkan pengguna, silakan coba lagi nanti',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const { password, ...result } = response;
      return result;
    } catch (error) {
      ResponseServerError();
    }
  }

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
