import { applyDecorators, createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';
import { Expose, Transform, Type } from 'class-transformer';
import { RESTAURANT_DEFAULT_DISTANCE } from '../constants/search.constant';


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
        Type(() => Number),
        Transform(({ value }) => {
            console.log("value", value);
            if (!value) return null;
            const price = (value as String).split(',')
            return  {min: Number(price[0]), max: Number(price[1])}
        })
    );
}


function convertToMeters(distance: string): number {
    const regex = /^(\d+)(km|m|mi|cm|ft)$/;
    const match = distance.match(regex);

    if (!match) {
        throw new BadRequestException(`Invalid distance format: ${distance}. We support only km, m, mi and ft units.`);
    }

    const value = parseFloat(match[1]);
    const unit = match[2].toLowerCase();

    switch (unit) {
        case 'km':
            return value;
        case 'm':
            return value / 1000;
        case 'mi':
            return value * 1.60934;
        case 'ft':
            return value * 0.0003048;
        default:
            throw new BadRequestException(`Unknown unit: ${unit}. We support only km, m, mi and ft.`);
    }
}


export function TransformDistance(default_distance = RESTAURANT_DEFAULT_DISTANCE): any {
    return applyDecorators(
        Expose(),
        Type(() => String),
        Transform(({ value }) => {
            if (!value) return default_distance;
            const distance = convertToMeters(value);
            return distance
        })
    );
}
