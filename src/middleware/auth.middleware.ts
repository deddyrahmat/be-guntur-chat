import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Rute yang tidak memerlukan autentikasi
    const publicRoutes = ['/auth/register', '/auth/login'];

    if (publicRoutes.includes(req.path)) {
      // Jika rute termasuk dalam publicRoutes, lanjutkan tanpa memeriksa token
      return next();
    }
    // Mendapatkan token dari header permintaan atau dari cookie atau dari mana pun Anda menyimpannya
    const token = req.headers.authorization?.replace('Bearer ', ''); // Misalnya, mengambil token dari header Authorization

    if (token) {
      try {
        // const decodedToken = this.jwtService.verify(token);
        const decodedToken = this.jwtService.verify(token, {
          secret: process.env.SECRET_KEY_JWT, // Ini adalah secret yang digunakan untuk memverifikasi token
        });
        // Simpan userId dalam objek request untuk digunakan di pengontrol
        req.user = { id: decodedToken.det, email: decodedToken.email };
        next();
      } catch (error) {
        throw new UnauthorizedException('Invalid token');
      }
    } else {
      throw new UnauthorizedException('Token not provided');
    }
  }
}
