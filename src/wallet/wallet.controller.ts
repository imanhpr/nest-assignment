import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard.js";
import { GetUser } from "../auth/user.decorator.js";
import User from "../models/User.model.js";
import { WalletService } from "./wallet.service.js";
import { CreateTransactionDTO } from "./DTO/wallet.dto.js";
import { Decimal } from "decimal.js";

@Controller("wallet")
@UseGuards(AuthGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get("list")
  transactionList(@GetUser() user: Omit<User, "password">) {
    return this.walletService.transactionList(user.id);
  }

  @Get()
  walletInfo(@GetUser() user: Omit<User, "password">) {
    return this.walletService.walletInfo(user);
  }

  @Post()
  createTransaction(
    @GetUser() user: Omit<User, "password">,
    @Body() { amount }: CreateTransactionDTO
  ) {
    const decmialAmount = new Decimal(amount);
    return this.walletService.createNewTransaction(user.id, decmialAmount);
  }
}
