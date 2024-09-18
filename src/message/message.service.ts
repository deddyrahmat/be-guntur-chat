import { Body, HttpStatus, Injectable, Post } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AddMessageDto } from './dto/add-message.dto';
import { HttpResponses, ResponseServerError } from '../utils/http-responses';

@Injectable()
export class MessageService {
  constructor(private prismaService: PrismaService) {}

  async createMessage(addMessageDto: AddMessageDto) {
    try {
      const { sender, receiver, message, createdAt } = addMessageDto;

      // Cari pengirim dan penerima berdasarkan alamat email
      const senderUser = await this.prismaService.user.findUnique({
        where: { email: sender },
      });
      if (!senderUser) {
        HttpResponses(`data ${sender} tidak ditemukan`, HttpStatus.NOT_FOUND);
      }
      const receiverUser = await this.prismaService.user.findUnique({
        where: { email: receiver },
      });
      if (!receiverUser) {
        HttpResponses(`data ${receiver} tidak ditemukan`, HttpStatus.NOT_FOUND);
      }

      // Cari percakapan yang sesuai berdasarkan pengirim dan penerima
      let conversation = await this.prismaService.conversation.findFirst({
        where: {
          AND: [
            { user_sender_id: senderUser.id },
            { user_receiver_id: receiverUser.id },
          ],
        },
      });

      // Jika percakapan tidak ditemukan, buat percakapan baru
      if (!conversation) {
        conversation = await this.prismaService.conversation.create({
          data: {
            user_sender: { connect: { id: senderUser.id } },
            user_receiver: { connect: { id: receiverUser.id } },
          },
        });
      }

      // Simpan pesan ke dalam tabel Message
      const result = await this.prismaService.message.create({
        data: {
          conversation: { connect: { id: conversation.id } },
          message,
          createdAt: new Date(createdAt),
        },
      });
      return result;
    } catch (error: any) {
      ResponseServerError();
    }
  }

  async findMessage(id: number) {
    // Cari semua percakapan di mana pengguna adalah pengirim atau penerima
    const messages = await this.prismaService.message.findMany({
      where: {
        OR: [
          { conversation: { user_sender_id: id } }, // Pesan dari percakapan yang pengirimnya adalah pengguna
          { conversation: { user_receiver_id: id } }, // Pesan dari percakapan yang penerimanya adalah pengguna
        ],
      },
      orderBy: {
        createdAt: 'asc', // Mengurutkan pesan berdasarkan tanggal pembuatan secara ascending
      },
      include: {
        conversation: {
          include: {
            user_sender: {
              select: {
                name: true, // Hanya memuat kolom name pengguna
                email: true, // Hanya memuat kolom email pengguna
              },
            },
            user_receiver: {
              select: {
                name: true, // Hanya memuat kolom name pengguna
                email: true, // Hanya memuat kolom email pengguna
              },
            },
          },
        },
      },
    });
    // console.log('messages', messages);
    return messages.map((item: any) => {
      // console.log('item.', item.conversation.user_sender);
      return {
        senderName: item.conversation.user_sender.name,
        receiverName: item.conversation.user_receiver.name,
        sender: item.conversation.user_sender.email,
        receiver: item.conversation.user_receiver.email,
        message: item.message,
        createdAt: item.createdAt,
      };
    });
  }
}
