import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { RedisService } from 'src/common/redis/services/redis.service';

export const REDIS_MICROSERVICE_KEY = 'REDIS_MICROSERVICE';

const redisMicroserviceFactory = {
  provide: REDIS_MICROSERVICE_KEY,
  useFactory: (configService: ConfigService) => {
    return ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        host: configService.get<string>('redis.host'),
        port: configService.get<number>('redis.port'),
        username: configService.get<string>('redis.user'),
        password: configService.get<string>('redis.password'),
      },
    });
  },
  inject: [ConfigService],
};

@Global()
@Module({
  imports: [],
  providers: [redisMicroserviceFactory, RedisService],
  exports: [redisMicroserviceFactory, RedisService],
})
export class RedisModule {}
