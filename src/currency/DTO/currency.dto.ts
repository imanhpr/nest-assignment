import { IsNotEmpty, IsNumberString, IsString } from "class-validator";

export class CurrencyDTO {
  @IsNumberString()
  @IsNotEmpty()
  value!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;
}
