import { Module } from '@nestjs/common';
import { RouterModule } from 'src/routers/routers.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    CommonModule,
    
    RouterModule.register(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}



// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { ConfigModule } from '@nestjs/config';
// import config from 'src/config';
// import appConfig from './config/app.config';
// import databaseConfig from './config/database.config';
// import { DatabaseOptionsService } from './common/database/services/database.options.service';
// import { RestaurantsModule } from './modules/restaurants/restaurants.module';

// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       isGlobal: true,
//       load: [appConfig, databaseConfig],
//     }),
//     // ... other imports
//     RestaurantsModule
//   ],
//   controllers: [AppController],
//   providers: [AppService, DatabaseOptionsService],
// })
// export class AppModule {}
