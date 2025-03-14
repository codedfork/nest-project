import { User } from "src/user/user.entity";

export interface IAddExpense {
    description: string;
    amount: number;
    paidBy: User;
    owedBy?: string[]
}


export interface IUpdateExpense{
    description: string;
    amount: number;
    paidBy: string;
}

export interface IAddExpenseOwedByUser {
    expenseId: string;
    userIds: string[];
}
