import { IsArray, IsNotEmpty, IsOptional, IsUUID } from "class-validator";
import { User } from "src/user/user.entity";

export class AddExpenseDto {
    @IsOptional()
    description: string;

    @IsNotEmpty()
    amount: number;

    @IsNotEmpty()
    @IsUUID()
    paidBy: User

    @IsNotEmpty()
    @IsArray()
    owedBy: User[]
}