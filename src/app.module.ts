import { Module } from '@nestjs/common';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {ALL_KEY_CONSTANTS, DEFAULT_ENV_FILE} from "./app.constants";
import {config} from "./config/envs/env.config";
import {MongooseModule} from "@nestjs/mongoose";
import {TravelModule} from "./modules/travel/travel.module";

@Module({
  imports: [
    ConfigModule.forRoot(
        {
          isGlobal: true,
          envFilePath : DEFAULT_ENV_FILE,
          load : [config]
        },
    ),
    MongooseModule.forRootAsync({
      imports : [ConfigModule],
      useFactory : async (configService : ConfigService) => ({
        uri : configService.get<string>(ALL_KEY_CONSTANTS.MONGODB),
        useNewUrlParser : true,
        useUnifiedTopology : true
      }),
      inject : [ConfigService]
    }),
      TravelModule
  ],
})
export class AppModule {}
