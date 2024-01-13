import { Token } from "@prisma/client";

export abstract class TokenRepository {
  abstract create(token: Omit<Token, 'id'>): Promise<Token>

  abstract findFirst(where: Partial<Token>): Promise<Token>

  abstract deleteMany(where: Partial<Token>): Promise<{ count: number}>
}