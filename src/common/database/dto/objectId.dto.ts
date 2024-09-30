import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';
import { IsMongoId } from 'class-validator';


export class ObjectIdDto {
    @IsMongoId()
    @Type(()=>Types.ObjectId)
    restaurant_id: string
}