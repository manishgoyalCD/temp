import { ApiProperty } from '@nestjs/swagger';
import { SetMetadata } from '@nestjs/common';
import { PaginationPage } from 'src/common/pagination/decorators/pagination.decorator';

export const ArticleGet = (...args: string[]) => SetMetadata('get-restaurants', args);
export class RestaurantGetDto {
    @ApiProperty()
    @PaginationPage()
    page: number;

  
  }