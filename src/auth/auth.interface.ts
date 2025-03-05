import { UUIDDTO } from "src/user/user.dto";

export interface IJwtPayload {
    email: string | undefined,
    id: string | undefined
}

export interface IJwtPayloadGoogle extends IJwtPayload {
    name: string | undefined
}


export interface IAuthPayload {
    email: string;
    password: string;
}
