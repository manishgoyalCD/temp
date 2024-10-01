import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticsearchModule, ElasticsearchOptionsFactory } from '@nestjs/elasticsearch';
import { SearchService } from './services/elastic_search.service';

import * as dotenv from "dotenv";
dotenv.config();


@Module({
  imports: [
    ConfigModule,
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>({
        node: `http://${configService.get<string>('elastic.host')}:${configService.get<number>('elastic.port')}`,
        auth: {
          username: configService.get<string>('elastic.username'),
          password: configService.get<string>('elastic.password'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [SearchService],
  exports: [SearchService],
})
export class EsSearchModule {}