import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { FastifyRequest } from "fastify";
import { validateOrReject } from "class-validator";
import { plainToInstance } from "class-transformer";
import { UserTokenPayload } from "./DTO/User.DTO.js";
import { EntityManager } from "@mikro-orm/core";
import User from "../models/User.model.js";

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly errorCode102 = {
    code: 102,
    msg: "Authorziton Header is empty or is invliad. please send a valid Bearer token",
  };
  private readonly errorCode103 = {
    code: 103,
    msg: "Token is invalid or expired. please get a new access token and try again",
  };
  private readonly logger = new Logger(AuthGuard.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly em: EntityManager
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const http = context.switchToHttp();
    const req = http.getRequest<FastifyRequest>();

    if (!req.headers.authorization)
      throw new ForbiddenException(this.errorCode102);

    const authHeader = req.headers.authorization;

    if (!authHeader.startsWith("Bearer "))
      throw new ForbiddenException(this.errorCode102);

    const token = authHeader.substring(7);

    try {
      const tokenObj: unknown = await this.jwtService.verifyAsync(token);
      const res = plainToInstance(UserTokenPayload, tokenObj);

      await validateOrReject(res, { whitelist: true });
      const user = await this.em.findOne(
        User,
        { id: res.id },
        { exclude: ["password"] }
      );
      if (user === null) return false;
      req.user = user;
      return true;
    } catch (err) {
      this.logger.warn(err);
    }
    throw new ForbiddenException(this.errorCode103);
  }
}

declare module "fastify" {
  interface FastifyRequest {
    user?: Omit<User, "password">;
  }
}
