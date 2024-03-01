import { Test, TestingModule } from "@nestjs/testing";
import { WalletService } from "./wallet.service";

import { describe, beforeEach, it, expect } from "vitest";

describe.todo("WalletService", () => {
  let service: WalletService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WalletService],
    }).compile();

    service = module.get<WalletService>(WalletService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
