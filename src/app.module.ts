import { Logger, Module, ValueProvider } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module.js";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { IEnvironmentVariables } from "./types/index.js";
import { WalletModule } from "./wallet/wallet.module.js";

const MikroOrmQueryLogger: ValueProvider = {
  provide: "MikroOrmQueryLogger",
  useValue: new Logger("mikro-orm"),
};
@Module({
  imports: [
    AuthModule,
    WalletModule,
    ConfigModule.forRoot({ cache: true, isGlobal: true }),
    MikroOrmModule.forRootAsync({
      providers: [MikroOrmQueryLogger],
      inject: [ConfigService, MikroOrmQueryLogger.provide],
      useFactory(
        configService: ConfigService<IEnvironmentVariables, false>,
        logger: Logger
      ) {
        const DB_PASSWORD = configService.getOrThrow<string>("DB_PASSWORD");
        const DB_USERNAME = configService.getOrThrow<string>("DB_USERNAME");
        const DB_HOST = configService.getOrThrow<string>("DB_HOST");
        const DB_NAME = configService.getOrThrow<string>("DB_NAME");
        const clientUrl = `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}`;
        return {
          entities: ["./dist/models"],
          entitiesTs: ["./src/models"],
          dbName: DB_NAME,
          driver: PostgreSqlDriver,
          clientUrl,
          debug: true,
          ensureDatabase: { forceCheck: true, create: true },
          forceUtcTimezone: true,
          logger: (msg) => logger.debug(msg),
        };
      },
    }),
  ],
})
export default class AppModule {}
