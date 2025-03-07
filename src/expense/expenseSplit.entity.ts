import { Entity, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { Expense } from './expense.entity';
import { User } from 'src/user/user.entity';

@Entity()
export class ExpenseSplit {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Expense, expense => expense.splits)
    expense: Expense;

    @ManyToOne(() => User, user => user.expenseSplits)
    user: User;

    @Column('decimal')
    splitAmount: number;

    @Column({ default: false })
    isPaid: boolean;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
