import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { FastifyRequest } from "fastify";
import User from "../models/User.model.js";

export const GetUser = createParamDecorator<
  unknown,
  ExecutionContext,
  Omit<User, "password">
>((_, ctx) => {
  const request = ctx.switchToHttp().getRequest<FastifyRequest>();
  if (request.user) return request.user;
  throw new ForbiddenException();
});
