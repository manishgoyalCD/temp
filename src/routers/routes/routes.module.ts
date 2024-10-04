import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { DishesModule } from 'src/modules/dishes/dishes.module';
import { RestaurantsModule } from 'src/modules/restaurants/restaurants.module';
import { ReviewsModule } from 'src/modules/reviews/review.module';
import { UserModule } from 'src/modules/user/user.module';

@Module({
    controllers: [
        // RestaurantsController
    ],
    providers: [],
    exports: [],
    imports: [
       RestaurantsModule,
       DishesModule,
       ReviewsModule,
       UserModule,
       AuthModule
    ],
})
export class RoutesModule {}
