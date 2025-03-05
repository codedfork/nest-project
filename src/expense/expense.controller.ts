import { Controller, Post, Body, Res } from "@nestjs/common";
import { AddExpenseDto } from "./expense.dto";
import { ExpenseService } from "./expense.service";
import { apiResponseOk, apiResponseServerError } from "src/utils/apiHandler";
import { ApiResponseMessages } from "src/common/api-response-messages";
import { Response } from "express";

@Controller('/expense')
export class ExpenseController {

    constructor(private readonly expenseService: ExpenseService) { }

    @Post('/create')
    public async create(@Body() expensePayload: AddExpenseDto, @Res() res: Response) {
        try {
            const expense = await this.expenseService.addExpense(expensePayload)
            if (expense) {
                apiResponseOk({ expense, 'message': ApiResponseMessages.CREATED }, res);
            }
        } catch (error) {
            apiResponseServerError(error, res);
        }
    }
}