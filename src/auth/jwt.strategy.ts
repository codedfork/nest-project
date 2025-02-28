import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService, private readonly userService:UserService ) {
       
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT from Authorization header
            ignoreExpiration: false, // Optional: You can configure to ignore expiration if needed
            secretOrKey: process.env.JWT_SECRET || '12345', // Secret used to verify JWT
        });
    }
    async validate(payload: any) {
        console.log("Jwt verification started.....",payload);
        // This will be called after the JWT is verified
        return this.userService.getOne(payload.id);
        // return this.authService.validateUser(payload.userId); // Add any extra validation logic here
    }
}
