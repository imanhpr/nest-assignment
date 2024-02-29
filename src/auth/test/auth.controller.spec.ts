import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "../auth.controller.js";
import { describe, beforeEach, it, expect } from "vitest";

describe("AuthController", () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
