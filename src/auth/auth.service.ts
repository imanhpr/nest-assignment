import {
  EntityManager,
  UniqueConstraintViolationException,
} from "@mikro-orm/postgresql";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { UserDTO } from "./DTO/User.DTO.js";
import User from "../models/User.model.js";
import { Logger } from "@nestjs/common/services/logger.service.js";
import { BadRequestException } from "@nestjs/common/exceptions/bad-request.exception.js";
import PasswordService from "../util/password.service.js";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export default class AuthService {
  private readonly errorCode101 = {
    code: 101,
    msg: "The email or password is invalid",
  };
  private readonly errorCode100 = {
    code: 100,
    detail: "the email is already exists.",
  };

  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly em: EntityManager,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService
  ) {}

  async createNewUser({
    password,
    email,
  }: UserDTO): Promise<{ success: boolean }> {
    const hashedPassword = await this.passwordService.generatePassword(
      password
    );
    const user = this.em.create(User, { password: hashedPassword, email });

    try {
      await this.em.persistAndFlush(user);
    } catch (err) {
      if (err instanceof UniqueConstraintViolationException) {
        this.logger.warn(err);
        throw new BadRequestException(this.errorCode100);
      }
      this.logger.error(err);
      throw new InternalServerErrorException();
    }
    return { success: true };
  }

  async login({ password, email }: UserDTO) {
    const user = await this.em.findOne(User, { email });
    if (user === null) throw new BadRequestException(this.errorCode101);

    const isPassEqual = await this.passwordService.comparePassword(
      password,
      user.password
    );

    if (isPassEqual)
      return {
        accessToken: await this.jwtService.signAsync({
          id: user.id,
        }),
      };
    throw new BadRequestException(this.errorCode101);
  }
}
