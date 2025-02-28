import { IsEmail, IsString, IsUUID } from "class-validator";

export class AuthBodyDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}

export class ValidateUserResponseDto {
    @IsEmail()
    email: string;

    @IsUUID()
    id: string

}