import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';

import bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * Returns all exisiting users in the repository
   */
  findAll(): Promise<User[]> {
    return this.usersRepository.find({
      select: {
        id: true,
        username: true,
        email: true,
        creationdate: true,
      },
    });
  }

  /**
   * Returns a user that matches provided email address, otherwise, returns null
   */
  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: {
        email: email,
      },
    });
  }

  /**
   * Returns a new created user:
   * 1. Creates a new user object with hashed password
   * 2. Saves it
   * 3. Throws an error if user already exists - checking by its email address
   */
  async create(body: CreateUserDto): Promise<User> {
    const user: User | null = await this.findByEmail(body.email);
    if (user) {
      throw new Error('The current user already exists');
    }

    return await this.usersRepository.save(
      this.usersRepository.create({
        username: body.username,
        email: body.email,
        password: await this.hashPassword(body.password),
        creationdate: new Date(),
      }),
    );
  }

  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
