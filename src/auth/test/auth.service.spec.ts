import { Test, TestingModule } from "@nestjs/testing";
import AuthService from "../auth.service.js";
import { describe, it, expect, beforeAll, test } from "vitest";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { SqliteDriver } from "@mikro-orm/sqlite";
import UtilModule from "../../util/util.module.js";
import { JwtModule } from "@nestjs/jwt";
import User from "../../models/User.model.js";
import { EntityManager } from "@mikro-orm/core";
import { BadRequestException } from "@nestjs/common";
import { UserDTO } from "../DTO/User.DTO.js";

describe("AuthService", () => {
  let service: AuthService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UtilModule,
        JwtModule.register({
          secret: "fake_secret_key_for_test",
          signOptions: { expiresIn: "30m" },
        }),
        MikroOrmModule.forRoot({
          driver: SqliteDriver,
          ensureDatabase: { create: true },
          dbName: ":memory:",
          entities: [User],
          allowGlobalContext: true,
        }),
      ],
      providers: [AuthService],
    }).compile();

    const em = module.get(EntityManager);
    const fake_user = new User();
    fake_user.email = "fakeuser@gmail.com";
    fake_user.password = "1234";
    await em.persistAndFlush(fake_user);

    service = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("createNewUser", () => {
    test("Happy Path 😄", () => {
      const resultPromise = service.createNewUser({
        email: "test@gmail.com",
        password: "testpass",
      });
      expect(resultPromise).resolves.toStrictEqual({ success: true });
    });
    it("it should return error since the user already exists in database", () => {
      const resultPromise = service.createNewUser({
        email: "fakeuser@gmail.com",
        password: "testpass",
      });
      expect(resultPromise).rejects.toThrowError(BadRequestException);
      expect(resultPromise).rejects.toHaveProperty("response", {
        code: 100,
        detail: "the email is already exists.",
      });
    });
  });

  describe("login", () => {
    const validUser: UserDTO = {
      email: "user1@gmail.com",
      password: "testpass",
    };
    beforeAll(async () => {
      await service.createNewUser(validUser);
    });
    test("Happy Path 😄 | Valid email and password", () => {
      const resultPromise = service.login(validUser);
      expect(resultPromise).resolves.toStrictEqual({
        accessToken: expect.any(String),
      });
    });
    it("should return BadRequestException since email is valid but password is invalid", () => {
      const resultPromise = service.login({
        email: validUser.email,
        password: "invalid_password",
      });
      expect(resultPromise).rejects.toThrow(BadRequestException);
      expect(resultPromise).rejects.toHaveProperty("response", {
        code: 101,
        msg: "The email or password is invalid",
      });
    });
    it("should return BadRequestException since email is invalid", () => {
      const resultPromise = service.login({
        password: validUser.password,
        email: "invalid@mail.com",
      });
      expect(resultPromise).rejects.toThrow(BadRequestException);
      expect(resultPromise).rejects.toHaveProperty("response", {
        code: 101,
        msg: "The email or password is invalid",
      });
    });
  });
});
