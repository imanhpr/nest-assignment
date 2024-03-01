import { EntityManager } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Injectable, Logger } from "@nestjs/common";
import { CurrencyDTO } from "./DTO/currency.dto.js";
import Currency from "../models/currency.model.js";
import { Decimal } from "decimal.js";

@Injectable()
export class CurrencyService {
  private readonly logger = new Logger(CurrencyService.name);
  constructor(private readonly em: EntityManager<PostgreSqlDriver>) {}

  async insertPrice({ name, value }: CurrencyDTO) {
    const decimalValue = new Decimal(value);
    const newPrice = this.em.create(
      Currency,
      { name, value: decimalValue },
      { partial: true, persist: true }
    );
    await this.em.flush();
    return newPrice;
  }
}
