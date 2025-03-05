import { Controller, Body, Res, Post, Req } from "@nestjs/common";
import { AuthBodyDto, ValidateUserResponseDto } from "./auth.dto";
import { AuthService } from "./auth.service";
import logger from "src/utils/logger";
import { apiResponseOk, apiResponseServerError } from "src/utils/apiHandler";
import { Request, Response } from "express";
import { ApiResponseMessages } from "src/common/api-response-messages";
import { OAuth2Client } from "google-auth-library";

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

    @Post('/google')
    public async googleLogin(@Req() req: Request, @Res() res: Response) {
        try {
            // Replace this with your actual Google Client ID
            const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

            const oAuth2Client = new OAuth2Client(CLIENT_ID);
            // Verify the Google ID token
            const ticket = await oAuth2Client.verifyIdToken({
                idToken: req.body.token,
                audience: CLIENT_ID, // Ensure this matches the client ID you used for your app
            });

            // Get the payload from the token
            const payload = ticket.getPayload();
            const token = await this.authService.createToken({ name: payload?.name, email: payload?.email, id: payload?.sub })
            if (token) {
                apiResponseOk({ token: token, email: payload?.email, message: ApiResponseMessages.AUTHENTICATED }, res)
            }
        } catch (error) {
            apiResponseServerError({ error, message: "Something went wrong with google Auth.." }, res);
        }

    }
}