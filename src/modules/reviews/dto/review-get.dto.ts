import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';
import { IsMongoId } from 'class-validator';
import { PaginationPage, PaginationPerPage, PaginationSort } from 'src/common/pagination/decorators/pagination.decorator';
import { IPaginationSort } from 'src/common/database/interfaces/database.interface';
import { REVIEW_DEFAULT_AVAILABLE_SORT, REVIEW_DEFAULT_SORT } from '../constants/review.constants';

export class ReviewGetDto {
   
    @ApiProperty({
        default: 20
    })
    @Type(()=>Number)
    @PaginationPage()
    page?: number;

    @ApiProperty({
        default: 20
    })
    @Type(()=>Number)
    @PaginationPerPage()
    per_page: number;

    @ApiProperty()
    @Type(()=>Number)
    rating?: number

    @PaginationSort(REVIEW_DEFAULT_SORT, REVIEW_DEFAULT_AVAILABLE_SORT)
    sort?: IPaginationSort;
  
  
}
