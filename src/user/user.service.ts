import { Injectable } from "@nestjs/common";
import { ICreateUser } from "./user.interface";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { plainToClass } from "class-transformer";
import * as bcrypt from 'bcrypt';
import { InjectRepository } from "@nestjs/typeorm";
@Injectable()
export class UserService {

    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {

    }
    public async createUser(data: ICreateUser) {
        const saltRounds = 10;
        data.password = await bcrypt.hash(data.password, saltRounds);
        const newUser = this.userRepository.create(data);
        const savedUser = await this.userRepository.save(newUser);
        return plainToClass(User, savedUser);
    }

    public async getAll(): Promise<User[]> {
        try {
            const users = await this.userRepository.find({
                select: ['id', 'name', 'email', 'address'],
                relations: ['paidExpenses', 'owedExpenses']
            });
            return users;
        } catch (error) {
            console.log(error);
            throw new Error('Error fetching users');
        }
    }

    //Get single user details
    public async getOne(id: string) {
        try {
            const users = await this.userRepository.find({
                select: ['id', 'name', 'email', 'address'],
                where: { id: id }
                // relations: ['posts']
            });
            return users;
        } catch (error) {
            throw new Error('Error fetching users');
        }
    }
}