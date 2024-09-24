import { Global, Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';
import configs from 'src/configs';
import { DatabaseModule } from 'src/common/database/database.module';
import { RedisModule } from 'src/common/redis/redis.module';
import { SearchModule } from './elastic_search/elastic_search.module';
import { PaginationModule } from './pagination/pagination.module';

@Global()
@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({
            load: configs,
            isGlobal: true,
            cache: true,
            envFilePath: ['.env'],
            expandVariables: true,
            // validationSchema: Joi.object({
            //     APP_NAME: Joi.string().required(),
            //     APP_ENV: Joi.string()
            //         .valid('development', 'production')
            //         .default('development')
            //         .required(),
            //     // APP_LANGUAGE: Joi.string()
            //     //     .valid(...Object.values())
            //     //     .default('en')
            //     //     .required(),

            //     HTTP_ENABLE: Joi.boolean().default(true).required(),
            //     HTTP_HOST: [
            //         Joi.string().ip({ version: 'ipv4' }).required(),
            //         Joi.valid('localhost').required(),
            //     ],
            //     HTTP_PORT: Joi.number().default(3000).required(),
            //     HTTP_VERSIONING_ENABLE: Joi.boolean().default(true).required(),
            //     HTTP_VERSION: Joi.number().required(),


            //     DATABASE_HOST: Joi.any()
            //         .default('mongodb://localhost:27017')
            //         .required(),
            //     DATABASE_NAME: Joi.any().default('ack').required(),
            //     DATABASE_USER: Joi.any().optional(),
            //     DATABASE_PASSWORD: Joi.any().optional(),
            //     DATABASE_DEBUG: Joi.boolean().default(false).required(),
            //     DATABASE_OPTIONS: Joi.any().optional(),


            //     AUTH_JWT_ACCESS_TOKEN_SECRET_KEY: Joi.string()
            //         .alphanum()
            //         .min(5)
            //         .max(50)
            //         .required(),
            //     AUTH_JWT_ACCESS_TOKEN_EXPIRED: Joi.string()
            //         .default('30m')
            //         .required(),

            //     AUTH_JWT_REFRESH_TOKEN_SECRET_KEY: Joi.string()
            //         .alphanum()
            //         .min(5)
            //         .max(50)
            //         .required(),
            //     AUTH_JWT_REFRESH_TOKEN_EXPIRED: Joi.string()
            //         .default('7d')
            //         .required(),
            //     AUTH_JWT_REFRESH_TOKEN_REMEMBER_ME_EXPIRED: Joi.string()
            //         .default('30d')
            //         .required(),
            //     AUTH_JWT_REFRESH_TOKEN_NOT_BEFORE_EXPIRATION:
            //         Joi.string().required(),


            //     AWS_CREDENTIAL_KEY: Joi.string().optional(),
            //     AWS_CREDENTIAL_SECRET: Joi.string().optional(),
            //     AWS_S3_REGION: Joi.string().optional(),
            //     AWS_S3_BUCKET: Joi.string().optional(),

            // }),
            validationOptions: {
                allowUnknown: true,
                abortEarly: true,
            },
        }),
        PaginationModule,
        DatabaseModule,
        RedisModule,
        SearchModule,
    ],
})
export class CommonModule {}
