import { IsJWT, IsString } from "class-validator";

export class CreateAuthenticateDTO {
  @IsString()
  email: string;

  @IsString()
  password: string;
}

export class DeleteAuthenticateDTO {
  @IsString()
  authenticateOrUserId: string;
}

export class ValidateAuthenticateDTO {
  @IsJWT()
  Authorization: string;
}
