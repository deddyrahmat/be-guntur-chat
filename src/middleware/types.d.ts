import { Request } from 'express';

declare module 'express' {
  interface Request {
    user?: object; // tambahkan properti userId ke Request
  }
}
