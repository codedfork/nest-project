import { Injectable } from "@nestjs/common";
import { IAddExpense, IUpdateExpense, IAddExpenseOwedByUser } from "./expense.interface";
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

    /**
     * Update an expense
     */
    public async updateExpense(expenseId: string, owedBy: Array<string>, payload: Partial<IUpdateExpense>) {
        const expense = await this.expenseRepository.findOne({ where: { id: expenseId }, relations: ['paidBy', 'splits.user'] });

        if (expense) {
            const updatedExpense = await this.expenseRepository.save(expense);

            const oldAmount = expense?.amount;
            const oldSplits = expense?.splits;
            if (payload.amount && payload.amount !== oldAmount) {
                const splitAmount = payload.amount / (owedBy.length + 1); //Adding 1 to split the same amount for payer
                const users = await this.userRepository.find({ where: { id: In(owedBy) } })
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
            //Split expense in users
            // if (owedBy?.length && updatedExpense) {
            //     const splitAmount = createdExpense.amount / (payload.owedBy.length + 1); //Adding 1 to split the same amount for payer

            //     const users = await this.userRepository.find({ where: { id: In(payload.owedBy) } })

            //     const splitExpenses = users.map((user) => {
            //         return this.expenseSplitRepository.create({
            //             expense,
            //             user,
            //             splitAmount
            //         });
            //     })

            //     //Saving batches of split expenses
            //     if (splitExpenses) {
            //         this.expenseSplitRepository.save(splitExpenses);
            //     }
            // }
        }

        return expense;
    }

    //Delete old split entry if amount is changed while updating an previous expense

    public async deleteOldSplits(oldSplits: Array<ExpenseSplit>) {
        if (oldSplits) {
            const oldSplitIds: any = oldSplits.map(split => split.id);
            const deletedRecords = await this.expenseSplitRepository.delete({ id: oldSplitIds })
        }
        // const splitIds: Array<number> = 
        // if (expenseId) {
        //     const deleted: boolean = await this.expenseSplitRepository.delete({ expense: expenseId })
        // }
    }


}