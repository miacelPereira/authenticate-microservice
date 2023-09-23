import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Headers,
} from "@nestjs/common";
import { AuthenticateService } from "./authenticate.service";
import {
  CreateAuthenticateDTO,
  DeleteAuthenticateDTO,
  ValidateAuthenticateDTO,
} from "./authenticate.dto";

@Controller("authenticate")
export class AuthenticateController {
  constructor(private readonly authenticateService: AuthenticateService) {}

  @Post()
  async create(
    @Body() createAuthenticateBody: CreateAuthenticateDTO
  ): Promise<{ access_token: string }> {
    return this.authenticateService.create(createAuthenticateBody);
  }

  @Delete(":autenticateOrUserId")
  async delete(@Param() param: DeleteAuthenticateDTO) {
    return this.authenticateService.delete(param);
  }

  @Get()
  async validate(@Headers("Authorization") authenticate: string) {
    return this.authenticateService.validate(authenticate);
  }
}
