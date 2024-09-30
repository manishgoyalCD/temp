import { Type } from "class-transformer";
import { IsMongoId } from "class-validator";
import { Types } from "mongoose";


export class RestaurantIdDto {
    @Type(()=>Types.ObjectId)
    // @IsMongoId()
    restaurant_id: string
}