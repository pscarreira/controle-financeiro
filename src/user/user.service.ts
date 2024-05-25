import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateUserDTO } from './dto/createUser.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

const PASSWORD_LENGTH = 6;
const PASSWORD_RANGE = 1000000;

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

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

    await this.prisma.user.create({ data: newUser });

    return { message: 'User created!' };
  }
}
