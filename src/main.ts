import { NestApplication, NestFactory } from '@nestjs/core';
import { Logger, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import { DatabaseOptionsService } from 'src/common/database/services/database.options.service';
import { AppModule } from 'src/modules/app/app.module';
import { WrapResponseInterceptor } from './common/response/decorators/response.decorator';
import { AllExceptionsFilter } from './common/exception_handler/exception_handler';
// import swaggerInit from './swagger';

async function bootstrap() {
    const app: NestApplication = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    const databaseOptionsService: DatabaseOptionsService = app.get(
        DatabaseOptionsService
    );
    const databaseUri: string =
    databaseOptionsService.createMongooseOptions().uri;
    const env: string = configService.get<string>('app.env');
    const host: string = configService.get<string>('app.http.host');
    const port: number = configService.get<number>('app.http.port');
    const globalPrefix: string = configService.get<string>('app.globalPrefix');
    const versioning: boolean = configService.get<boolean>(
        'app.versioning.enable'
    );
    const versioningPrefix: string = configService.get<string>(
        'app.versioning.prefix'
    );

    const version: string = configService.get<string>('app.versioning.version');
    const logger = new Logger();
    (process.env.NODE_ENV as any) = env;

    // Global
    app.useGlobalInterceptors(new WrapResponseInterceptor());
    app.useGlobalFilters(new AllExceptionsFilter());
    app.setGlobalPrefix(globalPrefix);
    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    // Versioning
    if (versioning) {
        app.enableVersioning({
            type: VersioningType.URI,
            defaultVersion: version,
            prefix: versioningPrefix,
        });
    }

    // Swagger
    // await swaggerInit(app);

    await app.listen(port, host);

    // logger.log(`==========================================================`);
    // logger.log(`Environment Variable`, 'NestApplication');
    // logger.log(JSON.parse(JSON.stringify(process.env)), 'NestApplication');

    logger.log(`==========================================================`);
    logger.log(
        `Http Server running on ${await app.getUrl()}`,
        'NestApplication'
    );
    logger.log(`Database uri ${databaseUri}`, 'NestApplication');
    logger.log(`==========================================================`);
}
bootstrap();
