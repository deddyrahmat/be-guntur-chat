import { HttpException, HttpStatus } from '@nestjs/common';

export const HttpResponses = (msg: string, status: number) => {
  throw new HttpException(msg, status);
};
