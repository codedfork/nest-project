import { Controller, Post, Body, Get, Res, Param } from "@nestjs/common";
import { AddExpenseDto, UpdateExpenseDto, UserIdDto } from "./expense.dto";
import { ExpenseService } from "./expense.service";
import { apiResponseOk, apiResponseServerError } from "src/utils/apiHandler";
import { ApiResponseMessages } from "src/common/api-response-messages";
import { Request, Response } from "express";

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

    //Get all expenses
    @Get('/get')
    public async get(@Res() res: Response) {
        try {
            const expenses = await this.expenseService.getAll();
            if (expenses) {
                apiResponseOk({ expenses, message: ApiResponseMessages.FETCHED }, res);
            }
        } catch (error) {
            apiResponseServerError(error, res);

        }
    }

    //Get user specific expenses
    @Get('/get/:userId')
    public async getExpensesByUserId(@Param() params: UserIdDto, @Res() res: Response) {
        try {
            const expenses = await this.expenseService.getExpensesByUserId(params.userId);
            apiResponseOk({ expenses, message: ApiResponseMessages.FETCHED }, res);
        } catch (error) {
            console.log(error);
            apiResponseServerError(error, res);
        }
    }
    //Get user specific split expenses
    @Get('/get/split/:userId')
    public async getSplitExpensesByUserId(@Param() params: UserIdDto, @Res() res: Response) {
        try {
            const expenses = await this.expenseService.getSplitExpensesByUserId(params.userId);
            apiResponseOk({ expenses, message: ApiResponseMessages.FETCHED }, res);
        } catch (error) {
            console.log(error);
            apiResponseServerError(error, res);
        }
    }

    //Edit an expense 
    @Post('/update')
    public async updateExpense(@Body() payload: UpdateExpenseDto, @Res() res: Response) {
        try {
            const updatedExpense = await this.expenseService.updateExpense(payload.expenseId, payload.owedBy, payload.expense);
            apiResponseOk({ updatedExpense, message: "Expense Updated" }, res);
        } catch (error: any) {
            console.log(error);
            apiResponseServerError({ error, "message": "Somthing Went wrong" }, res);
        }
    }


}