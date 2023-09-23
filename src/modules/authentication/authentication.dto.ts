import { IsJWT, IsString } from "class-validator";

export class CreateAuthenticationDTO {
  @IsString()
  email: string;

  @IsString()
  password: string;
}

export class DeleteAuthenticationDTO {
  @IsString()
  authenticationOrUserId: string;
}

export class ValidateAuthenticationDTO {
  @IsJWT()
  Authorization: string;
}
