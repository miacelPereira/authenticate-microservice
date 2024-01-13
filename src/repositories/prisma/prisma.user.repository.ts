import { Injectable } from "@nestjs/common";
import { UserRepository } from "../user.repository";
import { User } from "@prisma/client";
import { PrismaService } from "src/providers/postgres/prisma.service";

@Injectable()
export class PrismaUserRepository implements UserRepository {
  
  constructor(private readonly prisma: PrismaService) {}

  async findFirst(where: Partial<User>): Promise<User> {
    return this.prisma.user.findFirst({ where });
  }

}