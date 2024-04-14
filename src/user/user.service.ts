import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from './../prisma.service';
import { hash } from 'bcrypt';
import { HttpResponses, ResponseServerError } from 'src/utils/http-responses';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

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

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

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
  async findById(id: number) {
    const response = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    return response;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
