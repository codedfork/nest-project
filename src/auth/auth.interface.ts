import { UUIDDTO } from "src/user/user.dto";

export interface IJwtPayload{
    email:string,
    id:string
}


export interface IAuthPayload{
    email:string;
    password:string;
}
