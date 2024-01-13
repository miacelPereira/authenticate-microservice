import { Module } from "@nestjs/common";
import { AuthenticationController } from "./authentication.controller";
import { AuthenticationService } from "./authentication.service";
import { PrismaService } from "src/providers/postgres/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { RedisService } from "src/providers/redis/redis.service";
import { TokenRepository } from "src/repositories/token.repository";
import { CacheTokenRepository } from "src/repositories/cache/cache.token.repository";
import { UserRepository } from "src/repositories/user.repository";
import { PrismaUserRepository } from "src/repositories/prisma/prisma.user.repository";

@Module({
  imports: [],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    PrismaService,
    RedisService,
    JwtService,
    { provide: TokenRepository, useClass: CacheTokenRepository },
    { provide: UserRepository, useClass: PrismaUserRepository }
  ],
})

export class AuthenticationModule {}
