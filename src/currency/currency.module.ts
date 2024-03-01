import { Module } from "@nestjs/common";
import { CurrencyService } from "./currency.service.js";
import { CurrencyController } from "./currency.controller.js";
import { AuthModule } from "../auth/auth.module.js";

@Module({
  imports: [AuthModule],
  providers: [CurrencyService],
  controllers: [CurrencyController],
})
export class CurrencyModule {}
