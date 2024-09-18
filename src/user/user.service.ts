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
import { HttpResponses, ResponseServerError } from '../utils/http-responses';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async searchUsers(
    user: any,
    keyword: string,
    page: number, //urutan data yang ditampilkan
    pageSize: number, //total data yang ditampilkan
  ) {
    const skip = (page - 1) * pageSize;
    let whereCondition: any = { role: 'user' };
    if (keyword && keyword !== ',') {
      whereCondition = {
        AND: [
          { role: 'user' },
          {
            OR: [
              { name: { contains: keyword } },
              { email: { contains: keyword } },
            ],
          },
        ],
      };
    }
    // Hitung total data yang ditemukan
    const totalFound = await this.prismaService.user.count({
      where: {
        ...whereCondition,
        NOT: {
          email: user.email,
        },
      },
    });
    // tambahkan filter untuk menampilkan selain user yang login
    const users = await this.prismaService.user.findMany({
      where: {
        ...whereCondition,
        NOT: {
          email: user.email, // Filter untuk menghindari pengguna dengan ID tertentu
        },
      },
      skip,
      take: pageSize,
    });
    return [users, totalFound];
  }

  async findAll() {
    try {
      const response = await this.prismaService.user.findMany({
        // where: {
        //   active: true, // Filter hanya pengguna dengan status aktif
        // },
        // take: 10, // Batasan jumlah pengguna yang dimuat
        select: {
          id: true,
          email: true,
          name: true,
          // active: true,
          role: true,
          createdAt: true,
        },
      });

      return response;
    } catch (error: any) {
      ResponseServerError();
    }
  }

  async findUserRole() {
    try {
      const response = await this.prismaService.user.findMany({
        where: {
          role: 'user', // Filter hanya pengguna dengan status aktif
        },
        // take: 10, // Batasan jumlah pengguna yang dimuat
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
      });

      return response;
    } catch (error: any) {
      ResponseServerError();
    }
  }
  async findUserRoleByEmail(email: string) {
    try {
      const response = await this.prismaService.user.findMany({
        where: {
          NOT: {
            email: email, // Filter untuk menghindari pengguna dengan ID tertentu
          },
          role: 'user', // Filter hanya pengguna dengan status aktif
        },
        // take: 10, // Batasan jumlah pengguna yang dimuat
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
      });

      return response;
    } catch (error: any) {
      ResponseServerError();
    }
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
