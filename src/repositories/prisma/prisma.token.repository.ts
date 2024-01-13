import { Injectable } from "@nestjs/common";
import { Token } from "@prisma/client";
import { PrismaService } from "src/providers/postgres/prisma.service";
import { TokenRepository } from "../token.repository";

@Injectable()
export class PrismaTokenRepository implements TokenRepository {
  
  constructor(private readonly prisma: PrismaService) {}

  async findFirst(where: Partial<Token>): Promise<Token> {
    return this.prisma.token.findFirst({ where });
  }

  async create(token: Omit<Token, "id">): Promise<Token> {
    return this.prisma.token.create({ data: token });
  }

  async deleteMany(where: Partial<Token>): Promise<{ count: number; }> {
    return this.prisma.token.deleteMany({ where });
  }
}
