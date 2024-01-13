import { Injectable } from "@nestjs/common";
import { RedisService } from "src/providers/redis/redis.service";
import { PrismaService } from "src/providers/postgres/prisma.service";
import { Token } from "@prisma/client";
import { TokenRepository } from "../token.repository";

@Injectable()
export class CacheTokenRepository implements TokenRepository {
  constructor(
    private readonly redis: RedisService,
    private readonly prisma: PrismaService
  ) {}

  async findFirst(where: Partial<Token>): Promise<Token> {
    const cacheToken = await this.redis.get(where.value);

    if (cacheToken) return JSON.parse(cacheToken);
    
    const persistedToken = await this.prisma.token.findFirst({ where });

    if (!persistedToken) return;

    await this.redis.set(persistedToken.value, JSON.stringify(persistedToken), "EX", process.env.CACHE_EXPIRES_IN);

    return persistedToken;
  }

  async create(token: Omit<Token, "id">): Promise<Token> {
    const persistedToken = await this.prisma.token.create({ data: token });
    
    await this.redis.set(token.value, JSON.stringify(persistedToken), "EX", process.env.CACHE_EXPIRES_IN);
    
    return persistedToken;
  }

  async deleteMany(where: Partial<Token>): Promise<{ count: number; }> {
    if (where.value) {
      await this.redis.del(where.value);
    }

    if (where.userId) {
      const allTokens = await this.prisma.token.findMany({ where });

      await this.redis.del(allTokens.map(item => item.value))
    }

    return this.prisma.token.deleteMany({ where });
  }
}