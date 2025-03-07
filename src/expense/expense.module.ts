import { Module } from "@nestjs/common";
import { Expense } from "./expense.entity";
import { ExpenseService } from "./expense.service";
import { ExpenseSplit } from "./expenseSplit.entity";
import { ExpenseController } from "./expense.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/user/user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Expense, ExpenseSplit, User])],
    providers: [ExpenseService],
    controllers: [ExpenseController]
})

export class ExpenseModule {

}
