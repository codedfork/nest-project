import { IsArray, IsNotEmpty, IsOptional, isUUID, IsUUID } from "class-validator";
import { User } from "src/user/user.entity";
import { CreateDateColumn, UpdateDateColumn } from "typeorm";

export class AddExpenseDto {
    @IsOptional()
    description: string;

    @IsNotEmpty()
    amount: number;

    @IsNotEmpty()
    @IsUUID()
    paidBy: User
}

export class UserIdDto {
    @IsUUID()
    userId: string
}