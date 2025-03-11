import { Injectable } from "@nestjs/common";
import { IAddExpense, IUpdateExpense, IAddExpenseOwedByUser } from "./expense.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Expense } from "./expense.entity";
import { Repository, In } from "typeorm";
import { ExpenseSplit } from "./expenseSplit.entity";
import { User } from "src/user/user.entity";
import logger from "src/utils/logger";

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
    public async updateExpense(expenseId: string, owedBy: Array<string>, payload: Partial<IUpdateExpense>): Promise<IUpdatedExpenseResponse> {
        const expense: any = await this.getExpenseById(expenseId, ['paidBy', 'splits.user']);
        const oldAmount: number = expense?.amount;
        const oldSplits = expense?.splits;
        Object.assign(expense, payload)
        //updating expenses with splits
        await this.expenseRepository.save(expense);
        if (expense) {
            const owedByOldUserIds: Array<string> = expense?.splits.map((split => split.user.id));
            if (payload.amount && payload.amount !== oldAmount) {
                //deleting old splits is amount is changed
                const rows = await this.deleteOldSplits(oldSplits);
                logger.info(`${rows} old splits affected/deleted and new amount is updated in old users for expense : ${expense.id}`)
                const splitAmount = payload.amount / (owedByOldUserIds.length + 1); //Adding 1 to split the same amount for payer
                // const splitUsers = await this.userRepository.find({ where: { id: In(owedByOldUserIds) } })
                const splitUsers = await this.getUsersByIds(owedByOldUserIds);
                const splitExpenses = splitUsers.map((user) => {
                    return this.expenseSplitRepository.create({
                        expense,
                        user,
                        splitAmount
                    });
                })
                //Saving batches of split expenses
                await this.expenseSplitRepository.save(splitExpenses);
            }
            else if (!this.compareTwoArrays(owedByOldUserIds, owedBy)) {
                //deleting old splits if owed by users are changed
                const rows = await this.deleteOldSplits(oldSplits);
                logger.info(`${rows} old splits affected/deleted and new users are updated with old amount for expense : ${expense.id}`)

                const splitAmount = oldAmount / (owedBy.length + 1); //Adding 1 to split the same amount for payer
                // const splitUsers = await this.userRepository.find({ where: { id: In(owedBy) } })
                const splitUsers = await this.getUsersByIds(owedBy);

                const splitExpenses = splitUsers.map((user) => {
                    return this.expenseSplitRepository.create({
                        expense,
                        user,
                        splitAmount
                    });
                })
                //Saving batches of split expenses
                await this.expenseSplitRepository.save(splitExpenses);
            }
            else if (payload.amount && payload.amount !== oldAmount && !this.compareTwoArrays(owedByOldUserIds, owedBy)) {
                //deleting old splits if amount and users are new
                const rows = await this.deleteOldSplits(oldSplits);
                logger.info(`${rows} old splits affected/deleted and new users and amount are updated for expense : ${expense.id}`)
                const splitAmount = payload.amount / (owedBy.length + 1); //Adding 1 to split the same amount for payer
                // const splitUsers = await this.userRepository.find({ where: { id: In(owedBy) } })
                const splitUsers = await this.getUsersByIds(owedBy);

                const splitExpenses = splitUsers.map((user) => {
                    return this.expenseSplitRepository.create({
                        expense,
                        user,
                        splitAmount
                    });
                })
                //Saving batches of split expenses
                await this.expenseSplitRepository.save(splitExpenses);
            }

        }

        const updatedExpense: any = await this.getExpenseById(expenseId, ['paidBy', 'splits.user']);
        // updatedExpense.splits = await this.expenseSplitRepository.find({ where: { expense: updatedExpense } });

        return updatedExpense;


    }

    //Delete old split entry if amount is changed while updating an previous expense
    public async deleteOldSplits(oldSplits: Array<ExpenseSplit>): Promise<any> {
        if (oldSplits) {
            const id: Array<number> = oldSplits.map(split => split.id);
            const deletedRecords = await this.expenseSplitRepository.delete(id);
            return deletedRecords.affected;
        }
    }

    //Function to check if updated expense owed by users are different from old users
    public compareTwoArrays(arr1: Array<string>, arr2: Array<string>) {
        const isEqual = arr1.length === arr2.length && arr1.sort().every((val, index) => val === arr2.sort()[index]);
        return isEqual;
    }

    //Function to get an expense by expense id
    public async getExpenseById(expenseId: string, relationNames: Array<string>) {
        return await this.expenseRepository.findOne({ where: { id: expenseId }, relations: relationNames });
    }

    //Function to get users by multiple ids 
    public async getUsersByIds(ids: Array<string>): Promise<User[]> {
        const users = await this.userRepository.find({ where: { id: In(ids) } });
        if (users.length !== ids.length) {
            const unknownId = users.filter((user, index) => {
                return !ids.includes(user.id)
            })
            console.log("yfewyffyfyfyufyu-----------------", unknownId);
        }
        return users;
        // return users;
    }



}