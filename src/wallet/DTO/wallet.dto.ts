import { IsNotEmpty, IsNumberString } from "class-validator";

export class CreateTransactionDTO {
  @IsNumberString()
  @IsNotEmpty()
  amount!: string;
}
