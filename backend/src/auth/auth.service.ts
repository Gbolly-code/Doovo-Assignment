import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

export interface User {
  id: number;
  email: string;
  password: string;
  role: 'customer' | 'washer';
}

// Hardcoded users for demo
const users: User[] = [
  { id: 1, email: 'customer@test.com', password: '1234', role: 'customer' }, // password: 1234
  { id: 2, email: 'washer@test.com', password: '1234', role: 'washer' }, // password: 1234
];

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser(email: string, password: string) {
    const user = users.find((u) => u.email === email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

   // const match = await bcrypt.compare(password, user.password);
    if (user.password != password) {
         throw new UnauthorizedException('Invalid credentials');
    }
    
    const { password: _, ...result } = user;
    return result;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const token = this.jwtService.sign({ sub: user.id, role: user.role });
    return { user, access_token: token };
  }
}
