import { Injectable } from "@nestjs/common";
import { IAddExpense, IAddExpenseOwedByUser } from "./expense.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Expense } from "./expense.entity";
import { Repository, In } from "typeorm";
import { ExpenseSplit } from "./expenseSplit.entity";
import { User } from "src/user/user.entity";

@Injectable()
export class ExpenseService {

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Expense) private readonly expenseRepository: Repository<Expense>,
        @InjectRepository(ExpenseSplit) private readonly expenseSplitRepository: Repository<ExpenseSplit>) { }

    /**
     * Function to add an expense with user
     * @param payload 
     */
    public async addExpense(payload: IAddExpense): Promise<Expense> {

        const expensePayload = Object.assign({}, payload);
        delete expensePayload.owedBy; //removing owedby from shallow copy
        const expense = this.expenseRepository.create(expensePayload);
        const createdExpense: Expense = await this.expenseRepository.save(expense);

        //Split expense in users
        if (payload.owedBy?.length && createdExpense) {
            const splitAmount = createdExpense.amount / (payload.owedBy.length + 1); //Adding 1 to split the same amount for payer

            const users = await this.userRepository.find({ where: { id: In(payload.owedBy) } })

            const splitExpenses = users.map((user) => {
                return this.expenseSplitRepository.create({
                    expense,
                    user,
                    splitAmount
                });
            })

            //Saving batches of split expenses
            if (splitExpenses) {
                this.expenseSplitRepository.save(splitExpenses);
            }
        }
        return createdExpense;
    }

    /**
     * Get all expenses
     */
    public async getAll(): Promise<Expense[]> {
        const expenses = await this.expenseRepository.find({
            relations: ['paidBy', 'splits.user']
        });
        return expenses;
    }

    /**
     * Get user specific expenses
     */
    public async getExpensesByUserId(userId: string) {
        const expenses = await this.userRepository.findOne({ where: { id: userId }, relations: ['paidExpenses'] })
        return expenses;
    }

    /**
     * Get split or owed expenses based on user id
     */
    public async getSplitExpensesByUserId(userId: string) {
        const expenses = await this.userRepository.findOne({ where: { id: userId }, relations: ['expenseSplits', 'expenseSplits.expense.paidBy'] })
        return expenses;
    }
}