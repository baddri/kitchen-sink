import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisService } from '../services/redis.service';
import { ProductModule } from '../api/product/product.module';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseService } from '../services/database.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService, RedisService, DatabaseService],
  exports: [RedisService, DatabaseService],
})
export class AppModule {}
