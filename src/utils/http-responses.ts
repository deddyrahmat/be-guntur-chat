import { HttpException, HttpStatus } from '@nestjs/common';

export const HttpResponses = (msg: string, status: number) => {
  throw new HttpException(msg, status);
};

export const ResponseServerError = () => {
  HttpResponses(
    'Oops! Server sedang mengalami masalah. Silakan coba beberapa saat lagi. ',
    HttpStatus.INTERNAL_SERVER_ERROR,
  );
};
