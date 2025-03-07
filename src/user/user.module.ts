import { Module } from "@nestjs/common";
import UserController from "./user.controller";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { JwtService } from "@nestjs/jwt";
import { JwtModule } from "@nestjs/jwt";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard } from "@nestjs/throttler";
import { Expense } from "src/expense/expense.entity";
import { ExpenseSplit } from "src/expense/expenseSplit.entity";



@Module({
    imports: [TypeOrmModule.forFeature([User, Expense, ExpenseSplit]), JwtModule.register({
        secret: process.env.JWT_SECRET,  // Your secret key
        signOptions: { expiresIn: '60m' },  // Token expiration time
    }),],
    providers: [UserService, JwtService, {
        provide: APP_GUARD,
        useClass: ThrottlerGuard
    },],
    controllers: [UserController],

})


export class UserModule {

}