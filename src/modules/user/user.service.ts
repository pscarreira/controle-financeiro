import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateUserDTO } from './dto/createUser.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/modules/mail/mailer.service';
import { ConfigService } from '@nestjs/config';
import { UpdateUserDTO } from './dto/updateUser.dto';

const PASSWORD_LENGTH = 6;
const PASSWORD_RANGE = 1000000;

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {
    this.createAdminUser();
  }

  private async createAdminUser() {
    const userAdmin = await this.prisma.user.findFirst({
      where: { username: 'admin' },
    });

    if (!userAdmin) {
      await this.prisma.user.create({
        data: {
          username: 'admin',
          email: this.configService.get('ADMIN_EMAIL'),
          password: await bcrypt.hashSync(
            this.configService.get('ADMIN_PASSWORD'),
            10,
          ),
        },
      });
    }
  }

  private async generatePassword(): Promise<string> {
    const password = Math.floor(Math.random() * PASSWORD_RANGE).toString();
    return password.padStart(PASSWORD_LENGTH, '0');
  }

  async createUser(user: CreateUserDTO): Promise<any> {
    // Check if the email or username already exists
    const userExists = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: user.email }, { username: user.username }],
      },
    });

    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const password = await this.generatePassword();
    const newUser: Prisma.UserCreateInput = {
      ...user,
      password: await bcrypt.hash(password, 10),
    };

    try {
      await this.mailService.sendWelcomeEmail(user.email, password);
    } catch (error) {
      throw new InternalServerErrorException('Error sending email', error);
    }

    await this.prisma.user.create({ data: newUser });

    return { message: 'User created!' };
  }

  async findUserByUsername(username: string) {
    if (username === 'admin') throw new NotFoundException('User not found');
    return this.prisma.user.findFirst({ where: { username } });
  }

  async findUserByEmailOrUsername(search: string) {
    return await this.prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: search } },
          { email: { contains: search } },
        ],
        AND: { NOT: { username: 'admin' } },
      },
      select: {
        username: true,
        email: true,
      },
    });
  }

  async deleteUser(id: number) {
    const user = await this.prisma.user.findFirst({
      where: { id },
    });

    if (!user) throw new NotFoundException('User not found');
    if (user.username === 'admin') throw new NotFoundException();

    return await this.prisma.user.delete({ where: { id } });
  }

  async updateUser(id: number, data: UpdateUserDTO) {
    const user = await this.prisma.user.findFirst({
      where: { id },
    });

    if (user.username === 'admin') throw new NotFoundException();
    if (!user) throw new NotFoundException('User not found');

    return await this.prisma.user.update({
      where: { id },
      data: { ...data },
      select: { username: true, email: true },
    });
  }
}
