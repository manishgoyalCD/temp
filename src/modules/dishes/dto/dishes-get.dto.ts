import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { SetMetadata } from '@nestjs/common';
import { PaginationPage, PaginationPerPage, PaginationSort } from 'src/common/pagination/decorators/pagination.decorator';
import { Type } from 'class-transformer';
import { TransformPriceRange } from 'src/modules/restaurants/decorators/restaurant.decorator';
import { DISHES_DEFAULT_AVAILABLE_SORT, DISHES_DEFAULT_SORT } from '../constants/dishes.constant';
import { IPaginationSort } from 'src/common/database/interfaces/database.interface';


export class DishesGetDto {
  
    @Type(()=>Number)
    @PaginationPage()
    page?: number;

    @ApiProperty({
      default: 20
    })
    @PaginationPage()
    @Type(()=>Number)
    @PaginationPerPage()
    per_page: number;

    @ApiProperty()
    @Type(()=>String)
    type: string;


    @ApiProperty()
    @Type(()=>Number)
    rating?: number

 
    @ApiProperty({})
    @TransformPriceRange()
    price_range?: {min: number|null, max: number|null}
  
    // @ApiProperty()
    // @Type(()=>String)
    // dietary: string
  
    @ApiHideProperty()
    @Type(()=>Number)
    skip?: number

    @PaginationSort(DISHES_DEFAULT_SORT, DISHES_DEFAULT_AVAILABLE_SORT)
    sort?: IPaginationSort;
 

  
  }