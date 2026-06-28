import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    // Load environment variables secara global
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Koneksi ke MongoDB Atlas menggunakan URI dari .env
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),

    ProductsModule,
  ],
})
export class AppModule {}
