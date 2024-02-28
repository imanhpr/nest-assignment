import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module.js";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [AuthModule, ConfigModule.forRoot({ cache: true })],
})
export default class AppModule {}
