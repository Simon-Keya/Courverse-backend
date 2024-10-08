import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login-auth.dto';
import { SignupDto } from './dto/signup-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const result = { ...user };
      delete result.password;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(signupAuthDto: SignupDto) {
    const hashedPassword = await bcrypt.hash(signupAuthDto.password, 10);
    const user = await this.usersService.create({
      ...signupAuthDto,
      password: hashedPassword,
    });

    const result = { ...user };
    delete result.password;

    return {
      ...result,
      access_token: this.jwtService.sign({
        username: result.username,
        sub: result.id,
      }),
    };
  }
}
