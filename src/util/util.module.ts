import { Module } from "@nestjs/common";
import PasswordService from "./password.service.js";

@Module({ providers: [PasswordService], exports: [PasswordService] })
export default class UtilModule {}
