import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Propway@123', // your postgres password
      database: 'propway', // your db name
      autoLoadEntities: true, // ✅ no need to manually list entities
      synchronize: true, // ⚠️ dev only
    }),
    AuthModule,
  ],
})
export class AppModule {}
