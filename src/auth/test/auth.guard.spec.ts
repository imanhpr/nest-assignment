import { Test, TestingModule } from "@nestjs/testing";
import { describe, it, expect, test, vi, beforeAll } from "vitest";
import { AuthGuard } from "../auth.guard.js";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { ExecutionContext, ForbiddenException } from "@nestjs/common";

const FAKE_VALID_USER_PAYLOAD: Readonly<any> = Object.freeze({
  id: 1,
});
const FAKE_EXPIRED_USER_PAYLOAD: Readonly<any> = Object.freeze({
  id: 2,
});
describe.only("AuthGuard", () => {
  let guard: AuthGuard;
  let token: string;
  let expiredToken: string;
  const mockExecContext = {
    switchToHttp: vi.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: "fake_secret_for_test",
          signOptions: { expiresIn: "30m" },
        }),
      ],
      providers: [AuthGuard],
    }).compile();
    const jwtService = module.get(JwtService);
    guard = module.get(AuthGuard);
    token = "Bearer " + jwtService.sign(FAKE_VALID_USER_PAYLOAD);
    expiredToken =
      "Bearer " +
      jwtService.sign(FAKE_EXPIRED_USER_PAYLOAD, { expiresIn: -100 });
  });

  it("should be defined", () => {
    expect(guard).toBeDefined();
  });
  it("should be instance of AuthGuard class", () => {
    expect(guard).toBeInstanceOf(AuthGuard);
  });
  test("Happy Path 😄", () => {
    mockExecContext.switchToHttp.mockReturnValueOnce({
      getRequest: () => ({ headers: { authorization: token } }),
    });

    const resultPromise = guard.canActivate(
      mockExecContext as unknown as ExecutionContext
    );

    expect(resultPromise).resolves.toBe(true);
  });

  it.each(["invalid_token", "", undefined])(
    "should throw errorCode102 since token is invliad | token = %s",
    (invalid_token) => {
      mockExecContext.switchToHttp.mockReturnValueOnce({
        getRequest: () => ({ headers: { authorization: invalid_token } }),
      });
      const resultPromise = guard.canActivate(
        mockExecContext as unknown as ExecutionContext
      );

      expect(resultPromise).rejects.toThrowError(ForbiddenException);
      expect(resultPromise).rejects.toHaveProperty("response", {
        code: 102,
        msg: "Authorziton Header is empty or is invliad. please send a valid Bearer token",
      });
    }
  );

  it("should return errorCode103 since token has been expired", () => {
    mockExecContext.switchToHttp.mockReturnValueOnce({
      getRequest: () => ({ headers: { authorization: expiredToken } }),
    });
    const resultPromise = guard.canActivate(
      mockExecContext as unknown as ExecutionContext
    );

    expect(resultPromise).rejects.toThrowError(ForbiddenException);
    expect(resultPromise).rejects.toHaveProperty("response", {
      code: 103,
      msg: "Token is invalid or expired. please get a new access token and try again",
    });
  });

  it("should return errorCode103 since token validation will going to fail", () => {
    mockExecContext.switchToHttp.mockReturnValueOnce({
      getRequest: () => ({
        headers: { authorization: "Bearer invalid_token" },
      }),
    });
    const resultPromise = guard.canActivate(
      mockExecContext as unknown as ExecutionContext
    );

    expect(resultPromise).rejects.toThrowError(ForbiddenException);
    expect(resultPromise).rejects.toHaveProperty("response", {
      code: 103,
      msg: "Token is invalid or expired. please get a new access token and try again",
    });
  });
});
