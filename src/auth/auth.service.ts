//src/auth/auth.service.ts
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    // check if user already exists
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return this.usersRepository.save(newUser);
  }

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(pass, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = { row_id: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  
  async decodeToken(token: string) {
  try {
    return this.jwtService.verify(token); // verifies + decodes
  } catch (err) {
    throw new UnauthorizedException('Invalid or expired token');
  }
}

}
