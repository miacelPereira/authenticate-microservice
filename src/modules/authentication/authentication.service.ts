import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/providers/postgres/prisma.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import {
  CreateAuthenticationDTO,
  DeleteAuthenticationDTO,
} from "./authentication.dto";
import { UserRepository } from "src/repositories/user.repository";
import { TokenRepository } from "src/repositories/token.repository";

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenRepository: TokenRepository,
    private jwtService: JwtService
  ) {}

  private async validateUser({
    email,
    password,
  }): Promise<{ userExternalId: number; userId: number }> {
    const user = await this.userRepository.findFirst({ email });

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

    await this.tokenRepository.create({
      value: accessToken,
      userId
    });

    return {
      access_token: accessToken,
    };
  }

  async delete({
    authenticationOrUserId,
  }: DeleteAuthenticationDTO): Promise<{ success: boolean }> {
    const where = !!Number(authenticationOrUserId)
      ? { userId: Number(authenticationOrUserId) }
      : { value: authenticationOrUserId };

    const token = await this.tokenRepository.deleteMany(where);

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

    const token = await this.tokenRepository.findFirst({ 
      value: authenticationWithoutPrefix
    });

    if (!token) {
      throw new HttpException("Token not found.", HttpStatus.UNAUTHORIZED);
    }

    try {
      await this.jwtService.verifyAsync(authenticationWithoutPrefix, {
        secret: process.env.JWT_SECRET,
      });

      return { userId: token.userId };
    } catch (error) {
      await this.tokenRepository.deleteMany({
        value: authenticationWithoutPrefix
      });

      throw new HttpException("Expired token.", HttpStatus.UNAUTHORIZED);
    }
  }
}
