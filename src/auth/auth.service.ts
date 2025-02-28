import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { IAuthPayload, IJwtPayload } from "./auth.interface";
import { User } from "src/user/user.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ValidateUserResponseDto } from "./auth.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>, private readonly jwtService: JwtService) { }
    // Create JWT for a user
    async createToken(jwtPayload: IJwtPayload): Promise<string> {
        return this.jwtService.sign({ email: jwtPayload.email, id: jwtPayload.id }, { secret: '12345' }); // Creates a JWT
    }

    // Validate user (can be used in your real authentication flow)
    async validateUser(authPayload: IAuthPayload): Promise<ValidateUserResponseDto | boolean> {
        // Logic for user validation, like querying database, etc.

        const isUser = await this.userRepository.findOne({
            where: {
                email: authPayload.email,
            }
        })

        if (isUser) {
            const password = await bcrypt.compare(authPayload.password, isUser?.password);
            if (password) {
                return {
                    email: isUser.email,
                    id: isUser.id
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
}