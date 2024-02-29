import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { FastifyRequest } from "fastify";

export const User = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<FastifyRequest>();
    // TODO: Add validation logic here if user does not exists
    return request.user;
  }
);
