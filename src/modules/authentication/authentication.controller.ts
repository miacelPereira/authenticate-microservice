import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Headers,
} from "@nestjs/common";
import { AuthenticationService } from "./authentication.service";
import {
  CreateAuthenticationDTO,
  DeleteAuthenticationDTO,
  ValidateAuthenticationDTO,
} from "./authentication.dto";

@Controller("authentication")
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post()
  async create(
    @Body() createAuthenticationBody: CreateAuthenticationDTO
  ): Promise<{ access_token: string }> {
    return this.authenticationService.create(createAuthenticationBody);
  }

  @Delete(":autenticationOrUserId")
  async delete(@Param() param: DeleteAuthenticationDTO) {
    return this.authenticationService.delete(param);
  }

  @Get()
  async validate(@Headers("Authorization") authentication: string) {
    return this.authenticationService.validate(authentication);
  }
}
