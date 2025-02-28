import { Controller, Post, Get, Logger, Body, Req, Res, Param } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserDto, UUIDDTO } from "./user.dto";
import { plainToInstance } from "class-transformer";
import { validate, validateOrReject, ValidationError } from "class-validator";
import { Request, Response } from "express";
import { apiResponseOk, apiResponseBadRequest, apiResponseServerError } from "src/utils/apiHandler";
import { User } from "./user.entity";
import { ApiResponseMessages } from "src/common/api-response-messages";
import logger from "src/utils/logger";
import { JwtService } from '@nestjs/jwt'
import { JwtPayload } from "jsonwebtoken";


@Controller('/user')

export default class UserController {

    constructor(private readonly userService: UserService, private readonly jwtService: JwtService) { }

    @Post('/create')
    public async create(@Body() reqBody: UserDto, @Res() res: Response) {
        try {
            const createdUser = await this.userService.createUser(reqBody);
            apiResponseOk(createdUser, res);
        }
        catch (error) {

            if (error instanceof Array) {
                const errors = error.map(value => Object.values(value.constraints)[0]);
                apiResponseBadRequest({ errors, message: "Validation Error" }, res);
                logger.error({ errors, message: "Validation Error" });

            } else if (error.code === '23505') {
                apiResponseBadRequest({ message: ApiResponseMessages.EMAIL_ALREADY_EXISTS }, res);
                logger.error(ApiResponseMessages.EMAIL_ALREADY_EXISTS);
            } else {
                apiResponseBadRequest(error, res);
                logger.error(ApiResponseMessages.INTERNAL_SERVER_ERROR, error);
            }
        }
    }

    @Post('/create/auth')
    public async createAndAuth(@Body() reqBody: UserDto, @Res() res: Response) {
        try {
            const createdUser = await this.userService.createUser(reqBody);
            if (createdUser) {
                const payload: JwtPayload = { 'id': createdUser.id, 'email': createdUser.email };
                const token = this.jwtService.sign(payload);
                apiResponseOk({ createdUser, 'message': ApiResponseMessages.CREATED, 'token': token }, res);
            }

        }
        catch (error) {

            if (error instanceof Array) {
                const errors = error.map(value => Object.values(value.constraints)[0]);
                apiResponseBadRequest({ errors, message: "Validation Error" }, res);
                logger.error({ errors, message: "Validation Error" });

            } else if (error.code === '23505') {
                apiResponseBadRequest({ message: ApiResponseMessages.EMAIL_ALREADY_EXISTS }, res);
                logger.error(ApiResponseMessages.EMAIL_ALREADY_EXISTS);
            } else {
                apiResponseBadRequest(error, res);
                logger.error(ApiResponseMessages.INTERNAL_SERVER_ERROR, error);

            }
        }
    }

    @Get('/get')
    public async get(@Res() res: Response) {
        try {
            const usersData = await this.userService.getAll();
            if (usersData) {
                apiResponseOk({ usersData, message: ApiResponseMessages.FETCHED }, res);
            } else {
                apiResponseOk({ usersData, message: ApiResponseMessages.NO_CONTENT }, res);

            }
        } catch (error: any) {
            logger.error(error);
            apiResponseServerError(error, res);
        }
    }

    @Get('/get/:id')
    public async getOne(@Param() params: UUIDDTO, @Res() res: Response) {
        try {
            const userData = await this.userService.getOne(params.id);
            if (userData.length) {
                apiResponseOk({ userData, message: ApiResponseMessages.FETCHED }, res);
            } else {
                apiResponseOk({ userData, message: ApiResponseMessages.USER_NOT_FOUND }, res);

            }
        } catch (error: any) {
            logger.error(error);
            apiResponseServerError(error, res);
        }
    }

}