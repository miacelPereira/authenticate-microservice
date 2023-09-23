import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/providers/postgres/prisma.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import {
  CreateAuthenticationDTO,
  DeleteAuthenticationDTO,
} from "./authentication.dto";

@Injectable()
export class AuthenticationService {
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
  }: CreateAuthenticationDTO): Promise<{ access_token: string }> {
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
    authenticationOrUserId,
  }: DeleteAuthenticationDTO): Promise<{ success: boolean }> {
    const where = !!Number(authenticationOrUserId)
      ? { userId: Number(authenticationOrUserId) }
      : { value: authenticationOrUserId };

    const token = await this.prisma.token.deleteMany({
      where,
    });

    return { success: !!token.count };
  }

  async validate(authentication: string) {
    if (!authentication) {
      throw new HttpException(
        "It is necessary to inform the token.",
        HttpStatus.UNAUTHORIZED
      );
    }

    const authenticationWithoutPrefix = authentication.replace("Bearer ", "");

    const token = await this.prisma.token.findFirst({
      where: { value: authenticationWithoutPrefix },
      include: { user: true },
    });

    if (!token) {
      throw new HttpException("Token not found.", HttpStatus.UNAUTHORIZED);
    }

    try {
      await this.jwtService.verifyAsync(authenticationWithoutPrefix, {
        secret: process.env.JWT_SECRET,
      });

      return { userId: token.user.id };
    } catch (error) {
      await this.prisma.token.deleteMany({
        where: { value: authenticationWithoutPrefix },
      });

      throw new HttpException("Expired token.", HttpStatus.UNAUTHORIZED);
    }
  }
}
