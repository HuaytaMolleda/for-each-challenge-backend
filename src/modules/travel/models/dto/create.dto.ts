import {ApiProperty} from "@nestjs/swagger";
import {IsBoolean,IsEnum, IsNumber, IsString} from "class-validator";
import {ConveyanceEnum} from "../enums/conveyance.enum";
import {Transform} from "class-transformer";

export class CreateDto{


    @IsString()
    @ApiProperty()
    startPoint : string

    @IsString()
    @ApiProperty()
    endPoint : string

    @IsNumber()
    @ApiProperty()
    @Transform((value)=>{ return parseInt(value)})
    kmQuantity : number

    @IsEnum(ConveyanceEnum)
    @ApiProperty()
    conveyanceWay : ConveyanceEnum

    @IsNumber()
    @ApiProperty()
    @Transform((value)=>{ return parseInt(value)})
    peopleInTravel : number

    @IsBoolean()
    @ApiProperty()
    isOneWay : boolean

}