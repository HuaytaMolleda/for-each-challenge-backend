import {Body, Controller, Delete, Get, Post, Query} from '@nestjs/common';
import {TravelService} from "./travel.service";
import {ApiOkResponse, ApiTags} from "@nestjs/swagger";
import {FindPaginateQuery, ListItemsDto} from "./models/dto/find";
import {CreateDto} from "./models/dto/create.dto";
import {Observable} from "rxjs";
import {TravelDocument} from "./models/schemas/travel.schema";


@ApiTags('travel-services')
@Controller('travel')
export class TravelController {

    constructor( private readonly travelService : TravelService) {
    }



    @Get('list')
    @ApiOkResponse({type : ListItemsDto})
    list(@Query() findPaginateQuery  : FindPaginateQuery) : Observable<ListItemsDto>{
        return this.travelService.list(findPaginateQuery)
    }


    @Post('create')
    create(@Body()  createDto : CreateDto) : Observable<TravelDocument>{
        return this.travelService.create(createDto)
    }

    @Delete('remove')
    delete() {
        return this.travelService.deleteAll()
    }

    @Get('types')
    listTypes(){
        return this.travelService.listTypes()
    }


}
