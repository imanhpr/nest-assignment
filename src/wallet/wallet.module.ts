import { Module } from "@nestjs/common";
import { WalletService } from "./wallet.service.js";
import { WalletController } from "./wallet.controller.js";
import { AuthModule } from "../auth/auth.module.js";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import Transaction from "../models/transaction.model.js";

@Module({
  imports: [AuthModule, MikroOrmModule.forFeature([Transaction])],
  providers: [WalletService],
  controllers: [WalletController],
})
export class WalletModule {}
