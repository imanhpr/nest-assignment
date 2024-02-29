import { IsDefined, IsEmail, IsNotEmpty, IsNumber } from "class-validator";

export class UserDTO {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsNotEmpty()
  password!: string;
}

export class UserTokenPayload {
  @IsNumber()
  @IsDefined()
  id!: number;
  @IsNumber()
  @IsDefined()
  iat!: number;
  @IsNumber()
  @IsDefined()
  exp!: number;
}
