import { User } from "src/user/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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


    @ManyToMany(() => User, user => user.id)
    @JoinTable()  // This will create the join table in the database
    owedBy: User[]

}