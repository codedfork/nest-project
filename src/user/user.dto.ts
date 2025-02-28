import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsStrongPassword, IsUUID } from "class-validator";

export class UserDto {
    @IsString()
    // @IsOptional()
    @IsNotEmpty()
    name : string;
    
    @IsString()
    @IsOptional()
    @IsEmail()
    email : string

    @IsString()
    @IsOptional()
    address : string

    @IsStrongPassword()
    @IsOptional()
    password: string

    @IsStrongPassword()
    @IsOptional()
    data: string
}

export class AssignRoleDto
{
    @IsString()
    userId:string

    @IsString()
    roleId:string
}

export class AssignedRoleResponseDto
{
    @IsString()
    userId:string

    @IsString()
    userName:string

    @IsString()
    roleId:string

    @IsString()
    roleName:string
}


export class UUIDDTO{
    @IsUUID()
    id:string
}