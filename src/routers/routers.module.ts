import { DynamicModule, Module } from '@nestjs/common';
import { RouterModule as NestJsRouterModule } from '@nestjs/core';
import { RoutesModule } from './routes/routes.module';

@Module({})
export class RouterModule {
    static register(): DynamicModule {
        if (process.env.HTTP_ENABLE === 'true') {
            return {
                module: RouterModule,
                controllers: [],
                providers: [],
                exports: [],
                imports: [
                    RoutesModule,
                    // NestJsRouterModule.register([{
                    //     path: '/',
                    //     module: RoutesModule
                    // }]),
                ],
            };
        }

        return {
            module: RouterModule,
            providers: [],
            exports: [],
            controllers: [],
            imports: [],
        };
    }
}
