import { Module } from "@nestjs/common";
import { Expense } from "./expense.entity";
import { ExpenseService } from "./expense.service";
import { User } from "src/user/user.entity";
import { ExpenseController } from "./expense.controller";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [TypeOrmModule.forFeature([Expense])],
    providers: [ExpenseService],
    controllers: [ExpenseController]
})

export class ExpenseModule {

}
