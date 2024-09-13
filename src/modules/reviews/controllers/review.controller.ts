import { Controller, Get } from '@nestjs/common';
import { ReviewService } from '../services/review.service';
import { RedisService } from 'src/common/redis/services/redis.service';


@Controller('review')
export class ReviewController {
    constructor(
        private readonly ReviewService: ReviewService,
        private readonly redisService: RedisService
    ) {}


    @Get('/')
    async findAll(): Promise<any> {
        return {
            dish : "",
            'fdsaf': await this.redisService.getKey('fdsaf')
        }
    }
}
