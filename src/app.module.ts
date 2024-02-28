import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module.js";

@Module({
  imports: [AuthModule],
})
export default class AppModule {}
