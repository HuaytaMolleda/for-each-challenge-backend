import { Module } from '@nestjs/common';
import { TravelController } from './travel.controller';
import { TravelService } from './travel.service';
import {MongooseModule} from "@nestjs/mongoose";
import {TRAVEL_SCHEMA} from "./travel.constants";
import {TravelSchema} from "./models/schemas/travel.schema";

@Module({
  imports : [
      MongooseModule.forFeature([{name : TRAVEL_SCHEMA,schema: TravelSchema }])
  ],
  controllers: [TravelController],
  providers: [TravelService]
})
export class TravelModule {}
