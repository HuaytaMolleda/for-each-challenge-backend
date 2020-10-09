import {Schema,Document} from "mongoose"
import {ConveyanceEnum} from "../enums/conveyance.enum";


export interface Travel{
    travelNumber : number
    startPoint : string
    endPoint : string
    conveyanceWay : ConveyanceEnum
    kmQuantity : number
    isOneWay : boolean
    peopleInTravel : number
    created_at : Date
    updated_at :Date
}

export interface TravelDocument extends  Document, Travel  {

}


export const TravelSchema = new Schema({
    travelNumber : Number,
    startPoint : String,
    endPoint : String,
    conveyanceWay : String,
    kmQuantity : Number,
    isOneWay  : Boolean,
    peopleInTravel : Number
},{

    timestamps: true,
    collection :"travels"
})