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
