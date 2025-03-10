import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsObject, IsOptional, IsUUID } from "class-validator";
import { User } from "src/user/user.entity";
import { CreateDateColumn, UpdateDateColumn } from "typeorm";

export class AddExpenseDto {
    @IsOptional()
    description: string;

    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @IsNotEmpty()
    @IsUUID()
    paidBy: User

    @IsNotEmpty()
    @IsArray()
    @IsUUID("4", { each: true })
    owedBy: string[]
}

export class UpdateExpenseDtoAdditionalFields {
    @IsOptional()
    description: string;

    @IsOptional()
    @IsNumber()
    amount: number;

    @IsOptional()
    @IsUUID()
    paidBy: string

}
export class UpdateExpenseDto {
    @IsNotEmpty()
    @IsUUID()
    expenseId: string

    @IsOptional()
    @IsNotEmpty()
    @IsArray()
    @IsUUID("4", { each: true })
    owedBy: string[]

    @IsObject()
    @IsOptional()
    @Type(() => UpdateExpenseDtoAdditionalFields)
    expense: UpdateExpenseDtoAdditionalFields
}



export class UserIdDto {
    @IsUUID()
    userId: string
}