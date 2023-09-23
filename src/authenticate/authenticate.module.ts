import { Module } from "@nestjs/common";
import { AuthenticateController } from "./authenticate.controller";
import { AuthenticateService } from "./authenticate.service";
import { PrismaService } from "src/providers/postgres/prisma.service";
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [],
  controllers: [AuthenticateController],
  providers: [AuthenticateService, PrismaService, JwtService],
})

export class AuthenticateModule {}
