import { Controller, Body, Res, Post } from "@nestjs/common";
import { AuthBodyDto, ValidateUserResponseDto } from "./auth.dto";
import { AuthService } from "./auth.service";
import logger from "src/utils/logger";
import { apiResponseOk, apiResponseServerError } from "src/utils/apiHandler";
import { Response } from "express";
import { ApiResponseMessages } from "src/common/api-response-messages";

@Controller('/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('/')
    public async login(@Body() authBody: AuthBodyDto, @Res() res: Response) {
        try {
            const validatedUser: ValidateUserResponseDto | boolean = await this.authService.validateUser(authBody);
            if (validatedUser && typeof validatedUser !== 'boolean') {
                // Using valueOf to get the email
                const token = await this.authService.createToken({
                    email: validatedUser.email,  // Using valueOf() to extract the email
                    id: validatedUser.id
                });
                if (token) {
                    apiResponseOk({ token: token, email: validatedUser.email, message: ApiResponseMessages.AUTHENTICATED }, res)
                }

            } else {
                throw new Error('Invalid credentials');
            }
        } catch (error) {
            logger.error(error.message);
            apiResponseServerError(error.message, res);
        }
    }
}