import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Transform} from "class-transformer";
import {ApiProperty} from "@nestjs/swagger";

export class FindPaginateQuery{

    @IsNumber()
    @IsNotEmpty()
    @Transform(parseInt)
    @ApiProperty({default : 10})
    size : number;

    @IsNumber()
    @IsNotEmpty()
    @Transform(parseInt)
    @ApiProperty({default : 1})
    page : number;

    @IsString()
    @IsOptional()
    @ApiProperty({required : false})
    term : string;

    constructor(partial: Partial<FindPaginateQuery>) {
        Object.assign(this, partial);
    }

}

export class FindDto {

    @ApiProperty()
    id   : string
    @ApiProperty()
    date : string
    @ApiProperty()
    startPoint : string
    @ApiProperty()
    endPoint : string
    @ApiProperty()
    kmQuantity : number
    @ApiProperty()
    conveyanceWay : string
    @ApiProperty()
    peopleInTravel : number
    @ApiProperty()
    isOneWay : boolean
    @ApiProperty()
    kgCO2ByPerson : number
    @ApiProperty()
    travelNumber : number

    constructor(partial: Partial<FindDto>) {
        Object.assign(this, partial);
    }
}

export class ListItemsDto{

    @ApiProperty()
    total : number

    @ApiProperty()
    items : Array<FindDto>


    constructor(partial: Partial<ListItemsDto>) {
        Object.assign(this, partial);
    }
}