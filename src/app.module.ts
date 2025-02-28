import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './user/user.entity';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the configuration globally available in your app
      envFilePath: '.env', // Specify the path to your .env file (default is '.env')
    }),
    TypeOrmModule.forRoot({
      type: "postgres", // Database type
      host: process.env.DB_HOST || "localhost", // Database host (e.g., "localhost" or a remote URL)
      port: Number(process.env.DB_PORT) || 5432, // Database port (default for PostgreSQL is 5432)
      username: process.env.DB_USERNAME || "your_username", // Database username
      password: process.env.DB_PASSWORD || "your_password", // Database password
      database: process.env.DB_NAME || "your_database_name", // Database name
      synchronize: true, // Automatically synchronize your schema (useful in development)
      logging: true, // Enable query logging (for development and debugging)
      entities: [User], // Specify your entities here
      migrations: [], // Optionally, specify migrations if you're using them
      subscribers: [], // Optional, for event listeners
    }),

    UserModule, AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
