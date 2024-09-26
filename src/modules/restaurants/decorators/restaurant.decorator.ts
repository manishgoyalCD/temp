import { applyDecorators, BadRequestException } from '@nestjs/common';
import { Expose, Transform, Type } from 'class-transformer';

class PriceRange {
    min: Number;
    max: Number;
}

class Location {
    lat: number;
    lon: number;
}

export function TransformLatLong(): any {
    return applyDecorators(
        Expose(),
        Type(() => Location),
        Transform(({ value }) => {
            if (!value) return null
            const locations = (value as String).split(',')
            
            return  {lat:Number(locations[0]), lon: Number(locations[1])}
        })
    );

}
export function TransformPriceRange(): any {
    return applyDecorators(
        Expose(),
        Type(() => PriceRange),
        Transform(({ value }) => {
            console.log("value", value);
            if (!value) return null;
            const locations = (value as String).split(',')
            return  {min: Number(locations[0]), max: Number(locations[1])}
        })
    );
}
