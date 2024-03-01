import { Test, TestingModule } from "@nestjs/testing";
import { CurrencyService } from "./currency.service";
import { describe, beforeEach, it, expect } from "vitest";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { SqliteDriver } from "@mikro-orm/sqlite";
import Currency from "../models/currency.model.js";
import Decimal from "decimal.js";
describe("CurrencyService", () => {
  let service: CurrencyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MikroOrmModule.forRoot({
          allowGlobalContext: true,
          driver: SqliteDriver,
          dbName: ":memory:",
          ensureDatabase: { create: true },
          entities: [Currency],
        }),
      ],
      providers: [CurrencyService],
    }).compile();

    service = module.get<CurrencyService>(CurrencyService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should insert a record with name USD and value must be instaceof Decimal('56000')", async () => {
    const data = { name: "USD", value: "56000" };
    expect(service.insertPrice(data)).resolves.toEqual({
      createdAt: expect.any(Date),
      id: 1,
      name: "USD",
      value: new Decimal("56000"),
    });
  });
});
