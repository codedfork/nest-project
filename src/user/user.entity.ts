import { Entity, Column, PrimaryGeneratedColumn, Unique, IsNull, OneToMany, ManyToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Expense } from 'src/expense/expense.entity';
// import { Post } from '../post/post.model';
// import { Role } from '../role/role.model';
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

    @OneToMany(() => Expense, expense => expense.owedBy)
    owedExpenses: Expense[]



    // @OneToMany(()=>Post, post=>post.user)
    // posts:Post[]

    // @ManyToOne(()=>Role, role=>role.user)
    // role:Role
}