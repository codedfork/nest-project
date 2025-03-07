import { User } from "src/user/user.entity";
import { Column, CreateDateColumn, UpdateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ExpenseSplit } from "./expenseSplit.entity";

@Entity()
export class Expense {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    description: string

    @Column()
    amount: number

    @ManyToOne(() => User, user => user.id)
    paidBy: User

    @OneToMany(() => ExpenseSplit, expenseSplit => expenseSplit.expense)
    splits: ExpenseSplit[]


    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}