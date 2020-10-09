import {ConflictException, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {TRAVEL_SCHEMA} from "./travel.constants";
import {Model} from "mongoose";
import {TravelDocument} from "./models/schemas/travel.schema";
import {FindDto, FindPaginateQuery, ListItemsDto} from "./models/dto/find";
import {from, Observable, of} from "rxjs";
import {concatMap, map, switchMap, toArray} from "rxjs/operators";
import {CalculateEmissionFactor, CalculateKgCO2ByPerson} from "./models/dto/calculate.dto";
import {ConveyanceEnum} from "./models/enums/conveyance.enum";
import {CreateDto} from "./models/dto/create.dto";
import * as moment from 'moment'
import {DATE_FORMAT} from './travel.constants'

@Injectable()
export class TravelService {


    constructor(@InjectModel(TRAVEL_SCHEMA) private readonly  travelModel :  Model<TravelDocument>) {
    }


    list( {size,page}  :FindPaginateQuery){
        return from(this.travelModel.find().skip((size.valueOf() * (page.valueOf() - 1))).limit(parseInt( String (size))))
            .pipe(
                concatMap((rows)=>{
                    return from(rows)
                        .pipe(
                            map((travelDocument) =>{

                                const isOneWay = travelDocument.isOneWay
                                const conveyanceWay : ConveyanceEnum = travelDocument.conveyanceWay
                                const kmQuantity : number = travelDocument.kmQuantity

                                const emissionFactor =  Number( this.calculateEmissionFactor({isOneWay,conveyanceWay,kmQuantity}))
                                const peopleInTravel : number =  travelDocument.peopleInTravel
                                const kgCO2ByPerson = Number(this.calculateKgCO2ByPerson({emissionFactor,peopleInTravel}))

                                return new FindDto({
                                    id : travelDocument.id,
                                    travelNumber : travelDocument.travelNumber,
                                    conveyanceWay : travelDocument.conveyanceWay,
                                    date : moment(travelDocument.created_at).format(DATE_FORMAT),
                                    endPoint : travelDocument.endPoint,
                                    startPoint : travelDocument.startPoint,
                                    isOneWay : travelDocument.isOneWay,
                                    kmQuantity : travelDocument.kmQuantity,
                                    peopleInTravel : travelDocument.peopleInTravel,
                                    kgCO2ByPerson : kgCO2ByPerson
                                })
                            })
                        )
                }),
                toArray(),
                map((items)=>{
                    return new ListItemsDto({
                        total : items.length,
                        items
                    })
                })
            )
    }

    deleteAll(){
        return this.travelModel.deleteMany({})
    }

    create( createDto : CreateDto) {
        const travelModel   = new this.travelModel()


        return from(this.travelModel.find())
            .pipe(
                switchMap((list)=>{
                    travelModel.isOneWay  = createDto.isOneWay
                    travelModel.startPoint = createDto.startPoint
                    travelModel.endPoint = createDto.endPoint
                    travelModel.conveyanceWay = createDto.conveyanceWay
                    travelModel.peopleInTravel = createDto.peopleInTravel
                    travelModel.kmQuantity = createDto.kmQuantity
                    travelModel.travelNumber = list.length != 0 ? list.length  + 1 : 1

                    return travelModel.save()
                })
            )




    }


    listTypes(): Observable<ConveyanceEnum[]>{
        return of(Object.values(ConveyanceEnum))
    }


    calculateEmissionFactor({ conveyanceWay,isOneWay,kmQuantity} : CalculateEmissionFactor) : string{
        return (this.switchConveyanceWay(conveyanceWay)*this.isOneWayFactor(isOneWay)*kmQuantity).toFixed(3)
    }
    calculateKgCO2ByPerson( {emissionFactor,peopleInTravel} : CalculateKgCO2ByPerson ) : string{
        return (emissionFactor/peopleInTravel).toFixed(3)
    }
    isOneWayFactor(isOneWay : boolean) : number{
        return isOneWay ? 1 : 2
    }

    switchConveyanceWay(conveyanceWay : ConveyanceEnum) : number{
        switch (conveyanceWay) {
            case ConveyanceEnum.AUTO:
                return 0.21
            case ConveyanceEnum.AVION_CHILE:
                return 0.279
            case ConveyanceEnum.AVION_INTERNACIONAL:
                return 0.179
            case ConveyanceEnum.BUS:
                return 0.012
            case ConveyanceEnum.CAMINANDO:
                return 0.0
            case ConveyanceEnum.CAMIONETA:
                return 0.249
            case ConveyanceEnum.METRO:
                return 0.033
            case ConveyanceEnum.MOTOCICLETA:
                return 0.092
            case ConveyanceEnum.TRANSANTIAGO:
                return 0.039
            default :
                throw new ConflictException("Conveyance way wasn't found")

        }
    }
}
