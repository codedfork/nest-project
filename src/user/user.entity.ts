import { Entity, Column, PrimaryGeneratedColumn, Unique, IsNull, OneToMany, ManyToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Expense } from 'src/expense/expense.entity';
import { ExpenseSplit } from 'src/expense/expenseSplit.entity';
@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string

    @Column({ unique: true })
    email: string

    @Column()
    address: string

    @Column({ nullable: true })
    @Exclude()
    password: string

    @OneToMany(() => Expense, expense => expense.paidBy)
    paidExpenses: Expense[]

    @OneToMany(() => ExpenseSplit, expenseSplit => expenseSplit.user)
    expenseSplits: ExpenseSplit[]

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}