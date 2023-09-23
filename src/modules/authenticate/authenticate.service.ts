import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/providers/postgres/prisma.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import {
  CreateAuthenticateDTO,
  DeleteAuthenticateDTO,
} from "./authenticate.dto";

@Injectable()
export class AuthenticateService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  private async validateUser({
    email,
    password,
  }): Promise<{ userExternalId: number; userId: number }> {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new HttpException("User do not exists.", HttpStatus.NOT_FOUND);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new HttpException("Invalid credentials.", HttpStatus.UNAUTHORIZED);
    }

    return { userExternalId: user.userExternalId, userId: user.id };
  }

  async create({
    email,
    password,
  }: CreateAuthenticateDTO): Promise<{ access_token: string }> {
    const { userExternalId, userId } = await this.validateUser({
      email,
      password,
    });

    const payload = { sub: userExternalId };

    const accessToken = await this.jwtService.signAsync(payload, {
      privateKey: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    await this.prisma.token.create({
      data: {
        value: accessToken,
        userId,
      },
    });

    return {
      access_token: accessToken,
    };
    return;
  }

  async delete({
    authenticateOrUserId,
  }: DeleteAuthenticateDTO): Promise<{ success: boolean }> {
    const where = !!Number(authenticateOrUserId)
      ? { userId: Number(authenticateOrUserId) }
      : { value: authenticateOrUserId };

    const token = await this.prisma.token.deleteMany({
      where,
    });

    return { success: !!token.count };
  }

  async validate(authenticate: string) {
    if (!authenticate) {
      throw new HttpException(
        "It is necessary to inform the token.",
        HttpStatus.UNAUTHORIZED
      );
    }

    const authenticateWithoutPrefix = authenticate.replace("Bearer ", "");

    const token = await this.prisma.token.findFirst({
      where: { value: authenticateWithoutPrefix },
      include: { user: true },
    });

    if (!token) {
      throw new HttpException("Token not found.", HttpStatus.UNAUTHORIZED);
    }

    try {
      await this.jwtService.verifyAsync(authenticateWithoutPrefix, {
        secret: process.env.JWT_SECRET,
      });

      return { userId: token.user.id };
    } catch (error) {
      await this.prisma.token.deleteMany({
        where: { value: authenticateWithoutPrefix },
      });

      throw new HttpException("Expired token.", HttpStatus.UNAUTHORIZED);
    }
  }
}
