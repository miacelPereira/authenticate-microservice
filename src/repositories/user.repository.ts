import { User } from "@prisma/client";

export abstract class UserRepository {
  abstract findFirst(where: Partial<User>): Promise<User>
}