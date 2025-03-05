import { Injectable } from "@nestjs/common";
import { IAddExpense } from "./expense.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Expense } from "./expense.entity";
import { Repository } from "typeorm";

@Injectable()
export class ExpenseService {

    constructor(@InjectRepository(Expense) private readonly expenseRepository: Repository<Expense>) { }

    /**
     * Function to add an expense with user
     * @param payload 
     */
    public async addExpense(payload: IAddExpense): Promise<Expense> {
        const expense = this.expenseRepository.create(payload);
        return await this.expenseRepository.save(expense);
    }
}