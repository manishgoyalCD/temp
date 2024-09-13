import { Module } from '@nestjs/common';
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
       UserModule
    ],
})
export class RoutesModule {}
