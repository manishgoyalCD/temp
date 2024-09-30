import { ApiProperty } from '@nestjs/swagger';
import { SetMetadata } from '@nestjs/common';
import { PaginationPage, PaginationPerPage } from 'src/common/pagination/decorators/pagination.decorator';
import { Type } from 'class-transformer';


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

  
  }