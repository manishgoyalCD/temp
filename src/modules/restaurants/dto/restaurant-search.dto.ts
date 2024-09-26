import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { SetMetadata } from '@nestjs/common';
import { PaginationPage, PaginationPerPage } from 'src/common/pagination/decorators/pagination.decorator';
import { TransformLatLong, TransformPriceRange } from '../decorators/restaurant.decorator';
import { Type } from 'class-transformer';

// export const ArticleGet = (...args: string[]) => SetMetadata('get-restaurants', args);

export class RestaurantSearchDto {
    @ApiProperty({
      default: 1
    })
    @Type(()=>Number)
    @PaginationPage()
    page?: number;

    @ApiProperty({
      default: 20
    })
    @PaginationPage()
    @Type(()=>Number)
    @PaginationPerPage()
    per_page?: number;

    @ApiProperty()
    @Type(()=>Number)
    rating?: number

    @ApiProperty()
    @Type(()=>Number)
    distance?: number

    @ApiProperty()
    @TransformLatLong()
    location: {lat:number, lon: number}

    @ApiProperty({})
    @TransformPriceRange()
    price_range?: {min: number|null, max: number|null}
  
    // @ApiProperty()
    // opening_hours?: [number, number]

    @ApiProperty()
    @Type(()=>String)
    dietary: string
  
    @ApiHideProperty()
    @Type(()=>Number)
    skip?: number
  
}