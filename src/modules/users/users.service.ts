import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/User.entity';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

    async findOne(filter: any, options: any = {}): Promise<User | undefined> {
        return this.userRepository.findOne({ where: filter, ...options });
    }
    
    async getUserForValidation(email: string) {
    return (
        await this.userRepository.query(
        `SELECT 
        users.id,
        users.name,
        users.email,
        users.password,
        users."createdAt"
        FROM users WHERE email = '${email}'`,
        )
    )?.[0];
    }

    async create(userData: Partial<User>) {
        const user = this.userRepository.create(userData);
        return this.userRepository.save(user);
    }
}
