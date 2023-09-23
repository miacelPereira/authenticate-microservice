import { Module } from "@nestjs/common";
import { AuthenticationController } from "./authentication.controller";
import { AuthenticationService } from "./authentication.service";
import { PrismaService } from "src/providers/postgres/prisma.service";
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, PrismaService, JwtService],
})

export class AuthenticationModule {}
