import {ConveyanceEnum} from "../enums/conveyance.enum";

export class CalculateEmissionFactor{

    conveyanceWay  : ConveyanceEnum
    kmQuantity : number
    isOneWay : boolean
}
export class CalculateKgCO2ByPerson{
    emissionFactor : number
    peopleInTravel : number
}