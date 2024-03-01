import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard.js";
import { CurrencyDTO } from "./DTO/currency.dto.js";
import { CurrencyService } from "./currency.service.js";

@Controller("currency")
@UseGuards(AuthGuard)
export class CurrencyController {
  constructor(private readonly curService: CurrencyService) {}
  @Post()
  insertCurrencyPrice(@Body() curDTO: CurrencyDTO) {
    return this.curService.insertPrice(curDTO);
  }
}
