import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { RedisService } from 'src/common/redis/services/redis.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(
        private readonly UserService: UserService,
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
