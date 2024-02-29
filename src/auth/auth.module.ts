import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller.js";
import AuthService from "./auth.service.js";
import UtilModule from "../util/util.module.js";
import { JwtModule } from "@nestjs/jwt";
import { AuthGuard } from "./auth.guard.js";
import { ConfigService } from "@nestjs/config";
import { IEnvironmentVariables } from "../types/index.js";

@Module({
  imports: [
    UtilModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService<IEnvironmentVariables, true>) {
        return {
          secret: configService.getOrThrow<string>("JWT_SECRET_KEY"),
          signOptions: { expiresIn: "30m" },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [AuthGuard, JwtModule],
})
export class AuthModule {}
