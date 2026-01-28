import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres_db',
      port: 5432,
      database: 'better-task-tracker',
      username: 'postgres',
      password: 'password',
      entities: [User],
      synchronize: true,
    }),
  ],
})
export class DatabaseModule {}
