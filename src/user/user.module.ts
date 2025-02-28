import { Module } from "@nestjs/common";
import UserController from "./user.controller";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { JwtService } from "@nestjs/jwt";
import { JwtModule } from "@nestjs/jwt";



@Module({
    imports:[TypeOrmModule.forFeature([User]), JwtModule.register({
          secret: process.env.JWT_SECRET,  // Your secret key
          signOptions: { expiresIn: '60m' },  // Token expiration time
        }),],
    providers:[UserService, JwtService],
    controllers:[UserController],
    
})


export class UserModule {
    
}